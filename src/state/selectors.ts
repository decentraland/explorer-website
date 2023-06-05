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
  SignInFlowV3 = 'sign_in_flow_v3_variant',
  WalletConnectV2 = 'wallet-connect-v2'
}

export enum VariantNames {
  New = 'new'
}

export function isFeatureEnabled(state: StoreType, key: string, appName: string = FF_APPLICATION_NAME): boolean {
  const name = `${appName}-${key}`
  const ff = state.featureFlags || defaultFeatureFlagsState
  return !!ff.flags[name]
}

export function getFeatureVariant(
  state: StoreType,
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
  state: StoreType,
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

export function isWaitingForRenderer(state: StoreType): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.WAITING_RENDERER
}

export function isLoginComplete(state: StoreType): boolean {
  return state.session?.kernelState?.loginStatus === LoginState.COMPLETED
}
