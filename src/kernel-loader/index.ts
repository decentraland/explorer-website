import { getEthereumProvider, restoreConnection } from '../eth/provider'
import { trackEvent, identifyUser, disableAnalytics } from '../integration/analytics'
import { injectKernel } from './injector'
import {
  setKernelAccountState,
  setKernelError,
  setRendererLoading,
  setKernelLoaded,
  setRendererVisible
} from '../state/actions'
import { store } from '../state/redux'
import { ProviderType } from 'decentraland-connect'
import { FeatureFlagsResult, fetchFlags } from '@dcl/feature-flags'
import { resolveUrlFromUrn } from '@dcl/urn-resolver'

export async function authenticate(providerType: ProviderType | null) {
  const provider = await getEthereumProvider(providerType, 1 /* mainnet */)

  const kernel = store.getState().kernel.kernel

  if (!kernel) throw new Error('Kernel did not load yet')

  kernel.authenticate(provider, providerType == null)
}

declare var globalThis: { KERNEL_BASE_URL?: string; RENDERER_BASE_URL?: string }

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

async function getVersions(flags: FeatureFlagsResult) {
  const qs = new URLSearchParams(document.location.search)

  if (qs.has('renderer')) {
    globalThis.RENDERER_BASE_URL = qs.get('renderer')!
  }

  if (qs.has('kernel-urn')) {
    globalThis.KERNEL_BASE_URL = qs.get('kernel-urn')!
  }

  if (qs.has('renderer-branch')) {
    globalThis.RENDERER_BASE_URL = `https://renderer-artifacts.decentraland.org/branch/${qs.get('renderer-branch')!}`
  }

  if (qs.has('kernel-branch')) {
    globalThis.KERNEL_BASE_URL = `https://explorer-web.decentraland.io/@dcl/kernel/branch/${qs.get('kernel-branch')!}`
  }

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
  console.log('Feature flags', flags)
  await getVersions(flags)

  const kernel = await injectKernel({
    kernelOptions: {
      baseUrl: await resolveBaseUrl(globalThis.KERNEL_BASE_URL || `urn:decentraland:off-chain:kernel-cdn:latest`)
    },
    rendererOptions: {
      container,
      baseUrl: await resolveBaseUrl(globalThis.RENDERER_BASE_URL || `urn:decentraland:off-chain:unity-renderer-cdn:latest`)
    }
  })

  kernel.trackingEventObservable.add(({ eventName, eventData }) => {
    trackEvent(eventName, eventData)
  })

  kernel.openUrlObservable.add(({ url }) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow != null) newWindow.opener = null
  })

  kernel.accountStateObservable.add((account) => {
    if (account.identity) {
      identifyUser(account.identity.address)
    }
    store.dispatch(setKernelAccountState(account))
  })

  kernel.signUpObservable.add(({ email }) => {
    identifyUser(email)
  })

  kernel.errorObservable.add((error) => {
    store.dispatch(setKernelError(error))
    if (error.level === 'fatal') {
      disableAnalytics()
    }
  })

  kernel.rendererVisibleObservable.add((event) => {
    console.log('visible', event)
    store.dispatch(setRendererVisible(event.visible))
  })

  kernel.loadingProgressObservable.add((event) => {
    store.dispatch(setRendererLoading(event))
  })

  return kernel
}

async function initLogin() {
  const provider = await restoreConnection()

  if (provider) {
    console.log('got previous provider', provider)
  }
}

export function startKernel() {
  initKernel()
    .then((kernel) => {
      store.dispatch(setKernelLoaded(kernel))

      return initLogin()
    })
    .catch((error) => {
      store.dispatch(setKernelError({ error }))
      console.error(error)
    })
}
