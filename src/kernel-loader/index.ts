import { disconnect, getEthereumProvider, restoreConnection } from '../eth/provider'
import { internalTrackEvent, identifyUser, disableAnalytics } from '../integration/analytics'
import { injectKernel } from './injector'
import {
  setKernelAccountState,
  setKernelError,
  setRendererLoading,
  setKernelLoaded,
  setRendererVisible
} from '../state/actions'
import { ErrorType, store } from '../state/redux'
import { ProviderType } from 'decentraland-connect'
import { FeatureFlagsResult, fetchFlags } from '@dcl/feature-flags'
import { resolveUrlFromUrn } from '@dcl/urn-resolver'
import { defaultWebsiteErrorTracker, track } from '../utils/tracking'
import { injectVersions } from '../utils/rolloutVersions'
import { KernelResult } from '@dcl/kernel-interface'
import { NETWORK } from '../integration/queryParamsConfig'
import { RequestManager } from 'eth-connect'

export async function authenticate(providerType: ProviderType | null) {
  try {
    let chainId = 1 // mainnet

    if (NETWORK === 'ropsten') {
      chainId = 3
    } else if (NETWORK !== 'mainnet') {
      store.dispatch(
        setKernelError({
          error: new Error(`Invalid NETWORK url param, valid options are 'ropsten' and 'mainnet'`),
          code: ErrorType.FATAL
        })
      )
      return
    }

    const { provider, chainId: providerChainId } = await getEthereumProvider(providerType, chainId)

    if (providerChainId !== chainId) {
      store.dispatch(
        setKernelError({
          error: new Error(
            `Network mismatch NETWORK url param is not equal to the provided by Ethereum Provider (${providerChainId})`
          ),
          code: ErrorType.NET_MISMATCH
        })
      )
      return
    }

    const rm = new RequestManager(provider)

    {
      const providerChainId = parseInt(await rm.net_version(), 10)
      if (providerChainId !== chainId) {
        store.dispatch(
          setKernelError({
            error: new Error(
              `Network mismatch NETWORK url param is not equal to the provided by Ethereum Provider (${providerChainId})`
            ),
            code: ErrorType.NET_MISMATCH
          })
        )
        return
      }
    }

    const kernel = store.getState().kernel.kernel

    if (!kernel) throw new Error('Kernel did not load yet')

    kernel.authenticate(provider, providerType == null)
  } catch (err) {
    defaultWebsiteErrorTracker(err)

    store.dispatch(
      setKernelError({
        error: err
      })
    )
  }
}

type RolloutRecord = {
  version: string
  percentage: number
  prefix: string
}

declare var globalThis: {
  KERNEL_BASE_URL?: string
  RENDERER_BASE_URL?: string
  ROLLOUTS?: Record<string, RolloutRecord>
}

globalThis.KERNEL_BASE_URL = process.env.REACT_APP_KERNEL_BASE_URL
globalThis.RENDERER_BASE_URL = process.env.REACT_APP_RENDERER_BASE_URL

async function resolveBaseUrl(urn: string): Promise<string> {
  if (urn.startsWith('urn:')) {
    const t = await resolveUrlFromUrn(urn)
    if (t) {
      console.log(urn, t)
      return (t + '/').replace(/(\/)+$/, '/')
    }
    throw new Error('Cannot resolve content for URN ' + urn)
  }
  return (new URL(`${urn}`, global.location.toString()).toString() + '/').replace(/(\/)+$/, '/')
}

function cdnFromRollout(rollout: RolloutRecord): string {
  return `https://cdn.decentraland.org/${rollout.prefix}/${rollout.version}`
}

async function getVersions(flags: FeatureFlagsResult) {
  const qs = new URLSearchParams(document.location.search)

  // 1. load from ROLLOUTS + CDN
  if (globalThis.ROLLOUTS && globalThis.ROLLOUTS['@dcl/kernel']) {
    globalThis.KERNEL_BASE_URL = cdnFromRollout(globalThis.ROLLOUTS['@dcl/kernel'])
  }
  if (globalThis.ROLLOUTS && globalThis.ROLLOUTS['@dcl/unity-renderer']) {
    globalThis.RENDERER_BASE_URL = cdnFromRollout(globalThis.ROLLOUTS['@dcl/unity-renderer'])
  }

  // 2. load from URN/URL PARAM
  if (qs.has('renderer')) {
    globalThis.RENDERER_BASE_URL = qs.get('renderer')!
  }
  if (qs.has('kernel-urn')) {
    globalThis.KERNEL_BASE_URL = qs.get('kernel-urn')!
  }

  // 3. load hot-branch
  if (qs.has('renderer-branch')) {
    globalThis.RENDERER_BASE_URL = `https://renderer-artifacts.decentraland.org/branch/${qs.get('renderer-branch')!}`
  }
  if (qs.has('kernel-branch')) {
    globalThis.KERNEL_BASE_URL = `https://sdk-team-cdn.decentraland.org/@dcl/kernel/branch/${qs.get('kernel-branch')!}`
  }

  // default fallback
  if (!globalThis.KERNEL_BASE_URL) {
    if (flags.variants['explorer-rollout-kernel-version']) {
      const version = flags.variants['explorer-rollout-kernel-version'].name
      globalThis.KERNEL_BASE_URL = `urn:decentraland:off-chain:kernel-cdn:${version}`
    }
  }

  if (!globalThis.RENDERER_BASE_URL) {
    if (flags.variants['explorer-rollout-unity-renderer-version']) {
      const version = flags.variants['explorer-rollout-unity-renderer-version'].name
      globalThis.RENDERER_BASE_URL = `urn:decentraland:off-chain:unity-renderer-cdn:${version}`
    }
  }
}

async function initKernel() {
  const container = document.getElementById('gameContainer') as HTMLDivElement

  const flags = await fetchFlags({ applicationName: 'explorer' })

  await getVersions(flags)

  const kernel = await injectKernel({
    kernelOptions: {
      baseUrl: await resolveBaseUrl(globalThis.KERNEL_BASE_URL || `urn:decentraland:off-chain:kernel-cdn:latest`),
      configurations: {}
    },
    rendererOptions: {
      container,
      baseUrl: await resolveBaseUrl(
        globalThis.RENDERER_BASE_URL || `urn:decentraland:off-chain:unity-renderer-cdn:latest`
      )
    }
  })

  kernel.on('trackingEvent', ({ eventName, eventData }) => {
    internalTrackEvent(eventName, eventData)
  })

  kernel.on('openUrl', ({ url }) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow != null) newWindow.opener = null
  })

  kernel.on('accountState', (account) => {
    if (account.identity) {
      identifyUser(account.identity.address)
    }
    store.dispatch(setKernelAccountState(account))
  })

  kernel.on('signUp', ({ email }) => {
    identifyUser(email)
  })

  kernel.on('error', (error) => {
    store.dispatch(setKernelError(error))
    if (error.level === 'fatal') {
      disableAnalytics()
    }
  })

  kernel.on('rendererVisible', (event) => {
    console.log('visible', event)
    store.dispatch(setRendererVisible(event.visible))
  })

  kernel.on('loadingProgress', (event) => {
    store.dispatch(setRendererLoading(event))
  })

  kernel.on('logout', () => {
    disconnect().catch(defaultWebsiteErrorTracker)
  })

  return kernel
}

async function initLogin(kernel: KernelResult) {
  const provider = await restoreConnection()

  if (provider && provider.account) {
    const storedSession = await kernel.hasStoredSession(provider.account, provider.chainId)

    if (storedSession) {
      track('automatic_relogin', { provider_type: provider.providerType })
      authenticate(provider.providerType).catch(defaultWebsiteErrorTracker)
    }
  }
}

export function startKernel() {
  track('initialize_versions', injectVersions({}))

  initKernel()
    .then((kernel) => {
      store.dispatch(setKernelLoaded(kernel))

      return initLogin(kernel)
    })
    .catch((error) => {
      store.dispatch(setKernelError({ error }))
      defaultWebsiteErrorTracker(error)
    })
}
