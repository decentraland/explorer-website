import { SessionTraits } from '../trackingEvents'
import { StoreType } from './redux'
import { defaultFeatureFlagsState, FF_APPLICATION_NAME } from './types'

// This function is used for every rollbar and segment events.
export function getRequiredAnalyticsContext(state: StoreType): SessionTraits {
  return {
    sessionId: state.session.sessionId
  }
}

export enum FeatureFlags {
  Stream = 'stream'
}

export function isFeatureEnabled(state: StoreType, key: string): boolean {
  const name = `${FF_APPLICATION_NAME}-${key}`
  const ff = state.featureFlags || defaultFeatureFlagsState
  return !!ff.flags[name]
}

export function getFeatureVariant(state: StoreType, key: string, defaultValue: string | undefined = undefined) {
  if (isFeatureEnabled(state, key)) {
    const name = `${FF_APPLICATION_NAME}-${key}`
    const variant = state.featureFlags.variants[name]
    if (variant?.payload?.value) {
      return variant?.payload?.value
    }
  }

  return defaultValue
}
