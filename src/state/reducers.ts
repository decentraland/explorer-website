import { AnyAction } from 'redux'
import { KernelAccountState, KernelResult, KernelError } from '@dcl/kernel-interface'
import {
  SET_KERNEL_ACCOUNT_STATE,
  SET_KERNEL_ERROR,
  SET_KERNEL_LOADED,
  SET_RENDERER_LOADING,
  SET_RENDERER_VISIBLE
} from './actions'
import { KernelState, SessionState, RendererState, ErrorState, FeatureFlags, ErrorType } from './redux'

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

export function sessionReducer(state: SessionState | undefined, action: AnyAction): SessionState {
  if (action.type === SET_KERNEL_ACCOUNT_STATE) {
    return { ...state, kernelState: action.payload as KernelAccountState }
  }
  return state || { kernelState: null }
}

export function rendererReducer(state: RendererState | undefined, action: AnyAction): RendererState {
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

export function featureFlagsReducer(state: FeatureFlags | undefined, action: any): FeatureFlags {
  return {
    sessionId: ''
  }
}

export function errorReducer(state: ErrorState | undefined, action: AnyAction): ErrorState | null {
  if (action.type === SET_KERNEL_ERROR) {
    const payload: KernelError = action.payload

    // TODO: properly handle errors from kernel and forward to rollbar/segment

    return {
      details: payload.error.toString(),
      type: ErrorType.LOADING
    }
  }

  return state || null
}
