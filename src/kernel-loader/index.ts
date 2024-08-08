import { trackConnectWallet } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getProviderChainId } from 'decentraland-dapps/dist/modules/wallet/utils/getProviderChainId'
import { connection } from 'decentraland-connect'
import { disconnect, getEthereumProvider, restoreConnection } from '../eth/provider'
import { internalTrackEvent, identifyUser, disableAnalytics } from '../integration/analytics'
import { injectKernel } from './injector'
import {
  setKernelAccountState,
  setKernelError,
  setRendererLoading,
  setKernelLoaded,
  setRendererReady,
  setDesktopDetected
} from '../state/actions'
import { ErrorType, store } from '../state/redux'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { FeatureFlagsResult, fetchFlags } from '@dcl/feature-flags'
import { resolveUrlFromUrn } from '@dcl/urn-resolver'
import { defaultWebsiteErrorTracker, defaultKernelErrorTracker, track } from '../utils/tracking'
import { injectVersions } from '../utils/rolloutVersions'
import { KernelError, KernelResult } from '@dcl/kernel-interface'
import {
  ENV,
  NETWORK,
  withOrigin,
  ensureOrigin,
  CATALYST,
  RENDERER_TYPE,
  SHOW_WALLET_SELECTOR,
  LOGIN_AS_GUEST
} from '../integration/url'
import { isElectron, launchDesktopApp } from '../integration/desktop'
import { isMobile, setAsRecentlyLoggedIn } from '../integration/browser'
import { FeatureFlags, isFeatureVariantEnabled } from '../state/selectors'

export function getWantedChainId() {
  let chainId: ChainId

  switch (NETWORK) {
    case 'goerli':
      chainId = ChainId.ETHEREUM_GOERLI
      break
    case 'sepolia':
      chainId = ChainId.ETHEREUM_SEPOLIA
      break
    default:
      chainId = ChainId.ETHEREUM_MAINNET
  }

  return chainId
}

export async function authenticate(providerType: ProviderType | null) {
  try {
    const wantedChainId = getWantedChainId()

    const { provider, chainId: providerChainId, account } = await getEthereumProvider(providerType, wantedChainId)

    if (providerChainId !== wantedChainId) {
      store.dispatch(
        setKernelError({
          error: new Error(
            `Network mismatch NETWORK url param is not equal to the provided by Ethereum Provider (wanted: ${wantedChainId} actual: ${providerChainId}, E01)`
          ),
          code: ErrorType.NET_MISMATCH,
          extra: {
            providerType,
            providerChainId: providerChainId,
            wantedChainId: wantedChainId
          }
        })
      )
      return
    }

    {
      const providerChainId = await getProviderChainId(provider)
      if (providerChainId !== wantedChainId) {
        store.dispatch(
          setKernelError({
            error: new Error(
              `Network mismatch NETWORK url param is not equal to the provided by Ethereum Provider (wanted: ${wantedChainId} actual: ${providerChainId}, E02)`
            ),
            code: ErrorType.NET_MISMATCH,
            extra: {
              providerType,
              providerChainId: providerChainId,
              wantedChainId: wantedChainId
            }
          })
        )
        return
      }
    }

    const kernel = store.getState().kernel.kernel

    if (!kernel) throw new Error('Kernel did not load yet')

    setAsRecentlyLoggedIn()

    kernel.authenticate(provider, providerType == null /* isGuest */)

    // Track that the users wallet has connected.
    // Only when the user has not connected as guest.
    if (providerType && account) {
      trackConnectWallet({ providerType, address: account, walletName: connection.getWalletName() })
    }
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      ['Fortmatic: User denied account access.', 'The user rejected the request.'].includes((err as Error)?.message)
    ) {
      return
    }

    if (
      err &&
      typeof err === 'object' &&
      typeof (err as Error)?.message == 'string' &&
      ((err as Error)?.message.includes('Already processing eth_requestAccounts.') ||
        (err as Error)?.message.includes('Please wait.'))
    ) {
      // https://github.com/decentraland/explorer-website/issues/46
      store.dispatch(
        setKernelError({
          error: new Error('Metamask is locked, please open the extension before continuing.'),
          code: ErrorType.METAMASK_LOCKED
        })
      )
      return
    }

    // If something went wrong, disconnect to prevent future errors next reload
    disconnect().catch(defaultWebsiteErrorTracker)

    defaultWebsiteErrorTracker(err)

    store.dispatch(
      setKernelError({
        error: err as Error
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
  EXPLORER_BASE_URL?: string
  ROLLOUTS?: Record<string, RolloutRecord>
}

globalThis.EXPLORER_BASE_URL = (import.meta as any).env.VITE_APP_EXPLORER_BASE_URL

async function resolveBaseUrl(urn: string): Promise<string> {
  if (urn.startsWith('urn:')) {
    const t = await resolveUrlFromUrn(urn)
    if (t) {
      return (t + '/').replace(/(\/)+$/, '/')
    }
    throw new Error('Cannot resolve content for URN ' + urn)
  }
  return (new URL(`${urn}`, global.location.toString()).toString() + '/').replace(/(\/)+$/, '/')
}

function cdnFromRollout(rollout: RolloutRecord): string {
  return cdnFromPrefixVersion(rollout.prefix, rollout.version)
}

function cdnFromPrefixVersion(prefix: string, version: string): string {
  return withOrigin(`${prefix}/${version}`, 'https://cdn.decentraland.org/')
}

async function getVersions(flags: FeatureFlagsResult) {
  const qs = new URLSearchParams(document.location.search)

  // 1. load from ROLLOUTS + CDN
  if (globalThis.ROLLOUTS && globalThis.ROLLOUTS['@dcl/explorer']) {
    globalThis.EXPLORER_BASE_URL = cdnFromRollout(globalThis.ROLLOUTS['@dcl/explorer'])
  }

  // 2. load from URN/URL PARAM
  const rendererUrl = qs.get('renderer')
  if (rendererUrl) {
    globalThis.EXPLORER_BASE_URL = ensureOrigin(rendererUrl)
  }

  // 3. load hot-branch
  const explorerBranch = qs.get('explorer-branch')
  if (explorerBranch) {
    globalThis.EXPLORER_BASE_URL = withOrigin(explorerBranch, 'https://renderer-artifacts.decentraland.org/branch/')
  }

  // 4. specific cdn versions
  const explorerVersion = qs.get('explorer-version')
  if (explorerVersion) {
    globalThis.EXPLORER_BASE_URL = cdnFromPrefixVersion('@dcl/explorer', explorerVersion)
  }

  // 5. @deprecated if we're in native, load kernel version (to mantain compatibility)
  if (RENDERER_TYPE === 'native') {
    const kernelVersion = qs.get('kernel-version')
    if (kernelVersion) {
      globalThis.EXPLORER_BASE_URL = cdnFromPrefixVersion('@dcl/kernel', kernelVersion)
    }
  }

  // default fallback

  if (!globalThis.EXPLORER_BASE_URL) {
    if (flags.variants['explorer-rollout-explorer-version']) {
      const version = flags.variants['explorer-rollout-explorer-version'].name
      globalThis.EXPLORER_BASE_URL = `https://cdn.decentraland.org/@dcl/explorer/${version}`
    }
  }
}

async function initKernel() {
  const container = document.getElementById('gameContainer') as HTMLDivElement

  const flags = await fetchFlags({ applicationName: 'explorer' })

  await getVersions(flags)

  const kernel = await injectKernel({
    kernelOptions: {
      baseUrl: await resolveBaseUrl(
        globalThis.EXPLORER_BASE_URL || `https://cdn.decentraland.org/@dcl/explorer/latest`
      ),
      configurations: {}
    },
    rendererOptions: {
      container,
      baseUrl: await resolveBaseUrl(globalThis.EXPLORER_BASE_URL || `https://cdn.decentraland.org/@dcl/explorer/latest`)
    }
  })

  kernel.on('trackingEvent', ({ eventName, eventData }) => {
    internalTrackEvent(eventName, { ...eventData, context: eventData.context || 'kernel' })
  })

  kernel.on('openUrl', ({ url }) => {
    try {
      const u = new URL(url)
      if (u.protocol === 'https:') {
        const newWindow = window.open(u.toString(), '_blank', 'noopener,noreferrer')
        if (newWindow != null) newWindow.opener = null
      } else {
        track('invalid_external_url', { url })
      }
    } catch (err: any) {
      defaultWebsiteErrorTracker(err)
    }
  })

  let isGuest = true
  let lastIdentity: string | null = null
  let email: string | undefined = undefined

  function identify() {
    if (lastIdentity) {
      identifyUser(lastIdentity, isGuest, email)
    }
  }

  kernel.on('accountState', (account) => {
    if (account.identity) {
      isGuest = !!account.isGuest
      lastIdentity = account.identity.address
      identify()
    }

    store.dispatch(setKernelAccountState(account))
  })

  kernel.on('signUp', (data) => {
    email = data.email
    identify()
  })

  // all errors are also sent as trackingEvent
  kernel.on('error', (error: KernelError) => {
    store.dispatch(setKernelError(error))

    defaultKernelErrorTracker(error.error, error.extra, error.level)
    // since setKernelError(error) produces an unrecoverable black screen of death, we disable analytics
    disableAnalytics()
  })

  kernel.on('rendererVisible', (event) => {
    store.dispatch(setRendererReady(event.visible))

    // TODO: move this into a saga for setRendererReady
    // if the kernel and renderer decides to load, we cleanup the error window
    if (event.visible) {
      track('enable_renderer', {})
      store.dispatch(setKernelError(null))
    }
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
  if (!isElectron()) {
    if (LOGIN_AS_GUEST && !SHOW_WALLET_SELECTOR) {
      authenticate(null).catch(defaultWebsiteErrorTracker)
      return
    }

    const provider = await restoreConnection()
    if (provider && provider.account) {
      const providerChainId = await getProviderChainId(provider.provider)

      // BUG OF decentraland-connect:
      // provider.chainId DOES NOT reflect the selected chain in the real provider
      const storedSession = await kernel.hasStoredSession(provider.account, providerChainId /* provider.chainId */)

      if (storedSession) {
        track('automatic_relogin', { provider_type: provider.providerType })
        authenticate(provider.providerType).catch(defaultWebsiteErrorTracker)
        return
      }
    }

    if (isFeatureVariantEnabled(store.getState(), FeatureFlags.SeamlessLogin) && !SHOW_WALLET_SELECTOR) {
      track('seamless_login')
      authenticate(null).catch(defaultWebsiteErrorTracker)
      return
    }
  }
}

export function startKernel() {
  if (NETWORK && NETWORK !== 'mainnet' && NETWORK !== 'goerli' && NETWORK !== 'sepolia') {
    store.dispatch(
      setKernelError({
        error: new Error(`Invalid NETWORK url param, valid options are 'mainnet', 'goerli' and 'sepolia'`),
        code: ErrorType.FATAL
      })
    )
    return
  }

  if (ENV) {
    store.dispatch(
      setKernelError({
        error: new Error(
          `The "ENV" URL parameter is no longer supported. Please use NETWORK=goerli or NETWORK=sepolia in the cases where ENV=zone was used`
        ),
        code: ErrorType.FATAL
      })
    )
    return
  }

  if (isElectron()) {
    if ((window as any).require) {
      store.dispatch(
        setKernelError({
          error: new Error(
            `You're using an old version of Decentraland Desktop. Please update it from https://github.com/decentraland/explorer-desktop-launcher/releases`
          ),
          code: ErrorType.FATAL
        })
      )
      return
    }
  }

  if (CATALYST) {
    track('custom_catalyst', { catalyst: CATALYST })
  }

  track('initialize_versions', injectVersions({}))

  if (!isMobile()) {
    return initKernel()
      .then((kernel) => {
        store.dispatch(setKernelLoaded(kernel))
        return initLogin(kernel)
      })
      .catch((error) => {
        store.dispatch(setKernelError({ error }))
        defaultWebsiteErrorTracker(error)
      })
  }
}
