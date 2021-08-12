import { store } from '../state/redux'
import { getRequiredAnalyticsContext } from '../state/selectors'
import { DEBUG_ANALYTICS } from './queryParamsConfig'

let analyticsDisabled = false

enum AnalyticsAccount {
  PRD = '1plAT9a2wOOgbPCrTaU8rgGUMzgUTJtU',
  DEV = 'a4h4BC4dL1v7FhIQKKuPHEdZIiNRDVhc'
}

// TODO fill with segment keys and integrate identity server
export function configureSegment() {
  // all decentraland.org domains are considered PRD
  if (globalThis.location.host.endsWith('.decentraland.org')) {
    return initialize(AnalyticsAccount.PRD)
  }

  return initialize(AnalyticsAccount.DEV)
}

// once this function is called, no more errors will be tracked neither reported to rollbar
export function disableAnalytics() {
  analyticsDisabled = true
  if ((window as any).Rollbar) {
    ;(window as any).Rollbar.configure({ enabled: false })
  }
  if (DEBUG_ANALYTICS) {
    console.info('exploer-website: DEBUG_ANALYTICS disableAnalytics')
  }
}

export function identifyUser(address: string) {
  if (window.analytics) {
    const userTraits = {
      sessionId: getRequiredAnalyticsContext(store.getState()).sessionId
    }

    if (DEBUG_ANALYTICS) {
      console.info('exploer-website: DEBUG_ANALYTICS identifyUser', address, userTraits)
    }

    window.analytics.identify(address, userTraits)
  }
}

async function initialize(segmentKey: string): Promise<void> {
  if (window.analytics.load) {
    // loading client for the first time
    window.analytics.load(segmentKey)
    window.analytics.page()
    window.analytics.ready(() => {
      window.analytics.timeout(1000)
    })
  }
}

// please use src/utils "track" function.
export function internalTrackEvent(eventName: string, eventData: Record<string, any>) {
  if (!window.analytics || analyticsDisabled) {
    return
  }

  const data = { ...eventData, ...getRequiredAnalyticsContext(store.getState()) }

  if (DEBUG_ANALYTICS) {
    console.info('exploer-website: DEBUG_ANALYTICS trackEvent', eventName, data)
  }

  window.analytics.track(eventName, data)
}
