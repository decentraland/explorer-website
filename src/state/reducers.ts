import { AnyAction } from 'redux'
import { v4 } from 'uuid'
import { connection } from 'decentraland-connect'
import { toFeatureList } from '@dcl/feature-flags'
import { KernelResult, KernelError, LoginState, KernelAccountState } from '@dcl/kernel-interface'
import {
  SET_BANNER,
  SET_KERNEL_ACCOUNT_STATE,
  SET_KERNEL_ERROR,
  SET_KERNEL_LOADED,
  SET_RENDERER_LOADING,
  SET_RENDERER_READY,
  SET_RENDERER_VISIBLE,
  SET_FEATURE_FLAGS,
  SET_CATALYST_AS_TRUSTED
} from './actions'
import {
  KernelState,
  SessionState,
  RendererState,
  ErrorState,
  BannerState,
  FeatureFlagsState,
  CatalystState
} from './redux'
import { errorToString } from '../utils/errorToString'
import { defaultFeatureFlagsState } from './types'
import { CATALYST } from '../integration/url'
import { track } from '../utils/tracking'

export function kernelReducer(state: KernelState | undefined, action: AnyAction): KernelState {
  if (action.type === SET_KERNEL_LOADED) {
    return { ...state, ready: true, kernel: action.payload as KernelResult }
  }
  return (
    state || {
      ready: false,
      kernel: null
    }
  )
}

const defaultSession: SessionState = {
  sessionId: v4(),
  connection: null,
  kernelState: null,
  ready: false
}

export function sessionReducer(state: SessionState | undefined, action: AnyAction): SessionState {
  if (!state) return defaultSession

  if (action.type === SET_KERNEL_ACCOUNT_STATE) {
    const kernelState = action.payload as KernelAccountState
    const ready =
      kernelState.loginStatus === LoginState.SIGN_UP ||
      kernelState.loginStatus === LoginState.WAITING_PROFILE ||
      kernelState.loginStatus === LoginState.COMPLETED

    return {
      ...state,
      connection: connection.getConnectionData() || null,
      kernelState,
      ready
    }
  }

  return state
}

export function rendererReducer(state: RendererState | undefined, action: AnyAction): RendererState {
  if (state && action.type === SET_RENDERER_READY) {
    return { ...state, ready: action.payload.ready }
  }
  if (state && action.type === SET_RENDERER_VISIBLE) {
    return { ...state, visible: action.payload.visible }
  } else if (state && action.type === SET_RENDERER_LOADING) {
    return { ...state, loading: action.payload }
  }
  return (
    state || {
      ready: false,
      version: 'latest',
      visible: false,
      loading: null
    }
  )
}

export function catalystReducer(state: CatalystState = { catalyst: CATALYST, trusted: !CATALYST }, action: AnyAction): CatalystState {
  if (action.type === SET_CATALYST_AS_TRUSTED && !!state.catalyst && !state.trusted) {
    return {
      ...state,
      trusted: true
    }
  }

  return state
}

export function errorReducer(state: ErrorState | undefined, action: AnyAction): ErrorState {
  if (action.type === SET_KERNEL_ERROR) {
    const payload: KernelError = action.payload

    if (!payload) {
      return { error: null }
    }

    if (!state?.error) {
      return {
        error: {
          details: errorToString(payload.error),
          type: payload.code as any,
          extra: payload.extra
        }
      }
    }
  }

  return state || { error: null }
}

export function bannerReducer(state: BannerState | undefined, action: AnyAction): BannerState {
  if (action.type === SET_BANNER) {
    return { banner: action.payload.banner }
  }

  return state || { banner: null }
}

export function featureFlagsReducer(
  state: FeatureFlagsState = defaultFeatureFlagsState,
  action: AnyAction
): FeatureFlagsState {
  if (action.type === SET_FEATURE_FLAGS) {
    const result: FeatureFlagsState = action.payload
    queueMicrotask(async () => track('feature_flags', {
      featureFlags: toFeatureList(result)
    }))

    return {
      ...state,
      ready: true,
      flags: {
        ...state.flags,
        ...result.flags
      },
      variants: {
        ...state.variants,
        ...result.variants
      }
    }
  }

  return state
}
