import { SessionTraits } from '../trackingEvents'
import { LoginState } from '@dcl/kernel-interface'
import { StoreType } from './redux'
import { defaultFeatureFlagsState, FF_APPLICATION_NAME } from './types'

// This function is used for every rollbar and segment events.
export function getRequiredAnalyticsContext(state: StoreType): SessionTraits {
  return {
    sessionId: state.session.sessionId
  }
}

export enum FeatureFlags {
  Stream = 'stream',
  WalletConnectV2 = 'wallet-connect-v2',
  SeamlessLogin = 'seamless_login_variant'
}

export enum VariantNames {
  New = 'new'
}

export enum ABTestingVariant {
  Enabled = 'enabled',
  Disabled = 'disabled'
}

export function isFeatureEnabled(
  state: Pick<StoreType, 'featureFlags'>,
  key: string,
  appName = FF_APPLICATION_NAME
): boolean {
  const name = `${appName}-${key}`
  const ff = state.featureFlags || defaultFeatureFlagsState
  return !!ff.flags[name]
}

export function getFeatureVariant(
  state: Pick<StoreType, 'featureFlags'>,
  key: string,
  options: { defaultValue?: string; appName: string } = { appName: FF_APPLICATION_NAME }
) {
  if (isFeatureEnabled(state, key)) {
    const name = `${options.appName}-${key}`
    const variant = state.featureFlags.variants[name]
    if (variant?.payload?.value) {
      return variant?.payload?.value
    }
  }

  return options.defaultValue
}

export function getFeatureVariantName(
  state: Pick<StoreType, 'featureFlags'>,
  key: string,
  options: { defaultValue?: string; appName: string } = { appName: FF_APPLICATION_NAME }
) {
  if (isFeatureEnabled(state, key)) {
    const name = `${options.appName}-${key}`
    const variant = state.featureFlags.variants[name]
    if (variant && variant.enabled) {
      return variant.name
    }
  }

  return options.defaultValue
}

export function isFeatureVariantEnabled(
  state: Pick<StoreType, 'featureFlags'>,
  key: string,
  appName = FF_APPLICATION_NAME
) {
  const variant = getFeatureVariantName(state, key, {
    appName,
    defaultValue: ABTestingVariant.Disabled
  })
  return variant === ABTestingVariant.Enabled
}

export function isWaitingForRenderer(state: Pick<StoreType, 'session'>): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.WAITING_RENDERER
}

export function isLoginComplete(state: Pick<StoreType, 'session'>): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.COMPLETED
}
