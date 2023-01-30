import { store } from '../state/redux'
import { getRequiredAnalyticsContext } from '../state/selectors'
import { errorToString } from '../utils/errorToString'
import { track } from '../utils/tracking'
import { getCurrentPosition } from './browser'
import { isElectron } from './desktop'
import { DEBUG_ANALYTICS, PLATFORM, RENDERER_TYPE } from './url'

let analyticsDisabled = false

enum AnalyticsAccount {
  PRD = '1plAT9a2wOOgbPCrTaU8rgGUMzgUTJtU',
  DEV = 'a4h4BC4dL1v7FhIQKKuPHEdZIiNRDVhc'
}

enum RollbarAccount {
  Web = '44963d3f89db4e5cbf552faba06c6ec0',
  Desktop = '73e7ead7a15d4de3b26cecdda99b63c2'
}

const authFlags = {
  isAuthenticated: false,
  isGuest: false,
  afterFatalError: false,
  ethAddress: null as null | string,
}

export type AnalyticsOptions = { integrations?: Record<string, boolean> }

export const defaultAnalyticsOptions: AnalyticsOptions = {
  integrations: {
    'All': true,
    'Google AdWords New': false
  }
}

// TODO fill with segment keys and integrate identity server
export function configureSegment() {
  // all decentraland.org domains are considered PRD
  if (globalThis.location.host.endsWith('.decentraland.org')) {
    return initialize(AnalyticsAccount.PRD)
  }

  return initialize(AnalyticsAccount.DEV)
}

function injectTrackingMetadata(payload: Record<string, any>): void {
  Object.assign(payload, getCurrentPosition())
  payload.dcl_is_authenticated = authFlags.isAuthenticated
  payload.dcl_is_guest = authFlags.isGuest
  payload.dcl_disabled_analytics = authFlags.afterFatalError
  payload.dcl_renderer_type = RENDERER_TYPE
  payload.dcl_kernel_platform = PLATFORM
  payload.dcl_eth_address = authFlags.ethAddress
}

export function configureRollbar() {
  function rollbarTransformer(payload: Record<string, any>): void {
    injectTrackingMetadata(payload)
  }

  const Rollbar = (window as any).Rollbar
  const accessToken  = isElectron() ? RollbarAccount.Desktop : RollbarAccount.Web

  if (Rollbar) {
    Rollbar.configure({
      accessToken,
      transform: rollbarTransformer
    })
  }
}

// once this function is called, no more errors will be tracked neither reported to rollbar
export function disableAnalytics() {
  track('disable_analytics', {})

  authFlags.afterFatalError = true
  analyticsDisabled = true

  if ((window as any).Rollbar) {
    ; (window as any).Rollbar.configure({ enabled: false })
  }

  if (DEBUG_ANALYTICS) {
    console.info('explorer-website: DEBUG_ANALYTICS disableAnalytics')
  }
}

export function trackError(error: string | Error, payload?: Record<string, any>) {
  if (analyticsDisabled) return

  if (DEBUG_ANALYTICS) {
    console.info('explorer-website: DEBUG_ANALYTICS trackCriticalError ', error)
  }
  if (!(window as any).Rollbar) return

  if (typeof error === 'string') {
    ; (window as any).Rollbar.critical(errorToString(error), payload)
  } else if (error && error instanceof Error) {
    ; (window as any).Rollbar.critical(
      errorToString(error),
      Object.assign(error, payload, { fullErrorStack: error.toString() })
    )
  } else {
    ; (window as any).Rollbar.critical(errorToString(error), payload)
  }
}

export function identifyUser(ethAddress: string, isGuest: boolean, email?: string) {
  authFlags.isGuest = isGuest
  authFlags.isAuthenticated = !!ethAddress
  authFlags.ethAddress = ethAddress

  if ((window as any).analytics) {
    const userTraits = {
      sessionId: getRequiredAnalyticsContext(store.getState()).sessionId,
      ethAddress,
      email
    }

    if (DEBUG_ANALYTICS) {
      console.info('explorer-website: DEBUG_ANALYTICS identifyUser', ethAddress, userTraits)
    }

    (window as any).analytics.identify(userTraits)
  }
}

async function initialize(segmentKey: string): Promise<void> {
  if ((window as any).analytics.load) {
    // loading client for the first time
    ;(window as any).analytics.load(segmentKey)
    ;(window as any).analytics.page()
    ;(window as any).analytics.ready(() => {
      (window as any).analytics.timeout(1000)
    })
  }
}

// please use src/utils "track" function.
export function internalTrackEvent(
  eventName: string,
  eventData: Record<string, any>,
  options?: { integrations?: Record<string, boolean> }
) {
  if (!(window as any).analytics || analyticsDisabled) {
    return
  }

  const data = { ...eventData, ...getRequiredAnalyticsContext(store.getState()) }

  injectTrackingMetadata(data)

  if (DEBUG_ANALYTICS) {
    console.info('explorer-website: DEBUG_ANALYTICS trackEvent', eventName, data, options)
  }

  (window as any).analytics.track(eventName, data, options ?? defaultAnalyticsOptions)
}
