import { store } from '../state/redux'
import { getAnalyticsContext } from '../state/selectors'
import { DEBUG_ANALYTICS } from './queryParamsConfig'

export function getTLD() {
  if (globalThis.location.search && globalThis.location.search.includes('ENV=')) {
    return globalThis.location.search.match(/ENV=(\w+)/)![1]
  }
  return globalThis.location.hostname.match(/(\w+)$/)![0]
}

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
}

export function identifyUser(address: string) {
  if (window.analytics) {
    const userTraits = getAnalyticsContext(store.getState())

    if (DEBUG_ANALYTICS) {
      console.info('exploer-website: identifyUser', address, userTraits)
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

export function trackEvent(eventName: string, eventData: Record<string, any>) {
  if (!window.analytics || analyticsDisabled) {
    return
  }

  const data = { ...eventData, ...getAnalyticsContext(store.getState()) }

  if (DEBUG_ANALYTICS) {
    console.info('exploer-website: trackEvent', eventName, data)
  }

  window.analytics.track(eventName, data)
}
