import { SessionTraits } from '../trackingEvents'
import { LoginState } from '@dcl/kernel-interface'
import { StoreType } from './redux'
import { defaultFeatureFlagsState } from './types'

// This function is used for every segment event.
export function getRequiredAnalyticsContext(state: StoreType): SessionTraits {
  return {
    sessionId: state.session.sessionId
  }
}

export enum FeatureFlags {
  Stream = 'explorer-stream',
  SeamlessLogin = 'explorer-seamless_login_variant'
}

export enum VariantNames {
  New = 'new'
}

export enum ABTestingVariant {
  Enabled = 'enabled',
  Disabled = 'disabled'
}

export function isFeatureEnabled(state: Pick<StoreType, 'featureFlags'>, key: string): boolean {
  const ff = state.featureFlags || defaultFeatureFlagsState
  return !!ff.flags[key]
}

export function getFeatureVariantValue(state: Pick<StoreType, 'featureFlags'>, key: string, defaultValue?: string) {
  if (isFeatureEnabled(state, key)) {
    const variant = state.featureFlags.variants[key]
    if (variant?.payload?.value) {
      return variant?.payload?.value
    }
  }

  return defaultValue
}

export function getFeatureVariantName(state: Pick<StoreType, 'featureFlags'>, key: string, defaultValue?: string) {
  if (isFeatureEnabled(state, key)) {
    const variant = state.featureFlags.variants[key]
    if (variant && variant.enabled) {
      return variant.name
    }
  }

  return defaultValue
}

export function isFeatureVariantEnabled(state: Pick<StoreType, 'featureFlags'>, key: string) {
  return getFeatureVariantName(state, key, ABTestingVariant.Disabled) === ABTestingVariant.Enabled
}

export function isWaitingForRenderer(state: Pick<StoreType, 'session'>): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.WAITING_RENDERER
}

export function isLoginComplete(state: Pick<StoreType, 'session'>): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.COMPLETED
}
