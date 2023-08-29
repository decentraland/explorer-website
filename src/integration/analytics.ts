import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import type { KernelSeverityLevel } from '@dcl/kernel-interface'
import { store } from '../state/redux'
import { getRequiredAnalyticsContext } from '../state/selectors'
import { errorToString } from '../utils/errorToString'
import { getRepositoryName, getRepositoryVersion, track } from '../utils/tracking'
import { getCurrentPosition } from './browser'
import { DEBUG_ANALYTICS, PLATFORM, RENDERER_TYPE } from './url'

let analyticsDisabled = false

enum AnalyticsAccount {
  PRD = '1plAT9a2wOOgbPCrTaU8rgGUMzgUTJtU',
  DEV = 'a4h4BC4dL1v7FhIQKKuPHEdZIiNRDVhc'
}

const authFlags = {
  isAuthenticated: false,
  isGuest: false,
  afterFatalError: false,
  ethAddress: null as null | string
}

export type AnalyticsOptions = { integrations?: Record<string, boolean> }

export const defaultAnalyticsOptions: AnalyticsOptions = {
  integrations: {
    All: true,
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

// once this function is called, no more errors will be tracked
export function disableAnalytics() {
  track('disable_analytics', {})

  authFlags.afterFatalError = true
  analyticsDisabled = true

  if (DEBUG_ANALYTICS) {
    console.info('explorer-website: DEBUG_ANALYTICS disableAnalytics')
  }
}

function kernelSeverityToSentrySeverity(level: KernelSeverityLevel): Sentry.SeverityLevel {
  switch (level) {
    case 'warning':
      return 'warning'
    case 'critical':
      return 'fatal'
    case 'fatal':
      return 'fatal'
    case 'serious':
      return 'error'
    default:
      return 'fatal'
  }
}

export function trackError(
  error: string | Error,
  payload?: Record<string, any>,
  level: KernelSeverityLevel = 'critical'
) {
  if (analyticsDisabled) return

  if (DEBUG_ANALYTICS) {
    console.info('explorer-website: DEBUG_ANALYTICS level: ', level, ' trackError ', error)
  }

  Sentry.withScope(function (scope) {
    payload = payload || {}
    injectTrackingMetadata(payload)
    scope.setLevel(kernelSeverityToSentrySeverity(level))
    scope.setExtras(payload || {})
    let err =
      typeof error === 'string'
        ? new Error(error)
        : error && error instanceof Error
        ? error
        : new Error(errorToString(error))
    Sentry.captureException(err)
  })
}

export function identifyUser(ethAddress: string, isGuest: boolean, email?: string) {
  authFlags.isGuest = isGuest
  authFlags.isAuthenticated = !!ethAddress
  authFlags.ethAddress = ethAddress

  if ((window as any).analytics) {
    const userTraits = {
      sessionId: getRequiredAnalyticsContext(store.getState()).sessionId,
      ethAddress,
      isGuest,
      email
    }

    if (DEBUG_ANALYTICS) {
      console.info('explorer-website: DEBUG_ANALYTICS identifyUser', ethAddress, userTraits)
    }

    ;(window as any).analytics.identify(userTraits)
  }
}

async function initialize(segmentKey: string): Promise<void> {
  if ((window as any).analytics.load) {
    // loading client for the first time
    ;(window as any).analytics.load(segmentKey)
    ;(window as any).analytics.page()
    ;(window as any).analytics.ready(() => {
      ;(window as any).analytics.timeout(1000)
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

  ;(window as any).analytics.track(eventName, data, options ?? defaultAnalyticsOptions)
}

function getSentryRelease() {
  const repository = getRepositoryName()
  const version = getRepositoryVersion()
  if (repository && version) {
    return `${repository}@${version}`
  }

  return undefined
}

function getSentryEnvironment() {
  const repository = getRepositoryName()
  const version = getRepositoryVersion()
  if (repository && version) {
    return 'production'
  }

  return 'development'
}

export function configureSentry() {
  Sentry.init({
    release: getSentryRelease(),
    environment: getSentryEnvironment(),
    dsn: 'https://d067f6e6fc9c467ca8deb2b26b16aab1@o4504361728212992.ingest.sentry.io/4504915943489536',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.001 // 1% of transactions
  })
}
