import { AnyAction } from 'redux'
import { v4 } from 'uuid'
import { connection } from 'decentraland-connect'
import { toFeatureList } from '@dcl/feature-flags'
import { KernelResult, KernelError, LoginState, KernelAccountState } from '@dcl/kernel-interface'
import {
  SET_BANNER,
  SET_DOWNLOAD_PROGRESS,
  SET_DOWNLOAD_NEW_VERSION,
  SET_DOWNLOAD_READY,
  SET_KERNEL_ACCOUNT_STATE,
  SET_KERNEL_ERROR,
  SET_KERNEL_LOADED,
  SET_DESKTOP_DETECTED,
  SET_RENDERER_LOADING,
  SET_RENDERER_READY,
  SET_RENDERER_VISIBLE,
  SET_FEATURE_FLAGS,
  SET_CATALYST_AS_TRUSTED,
  setDesktopDetected
} from './actions'
import {
  KernelState,
  SessionState,
  RendererState,
  ErrorState,
  BannerState,
  DownloadState,
  DownloadCurrentState,
  FeatureFlagsState,
  CatalystState,
  DesktopState
} from './redux'
import { errorToString } from '../utils/errorToString'
import { isElectron } from '../integration/desktop'
import { defaultFeatureFlagsState } from './types'
import { CATALYST } from '../integration/url'
import { track } from '../utils/tracking'

export function decktopReducer(state: DesktopState | undefined, action: ReturnType<typeof setDesktopDetected>): DesktopState {
  if (action.type === SET_DESKTOP_DETECTED && action.payload) {
    return { ...state, detected: true }
  }
  return state || { detected: false }
}

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

export function downloadReducer(state: DownloadState | undefined, action: AnyAction): DownloadState {
  const defaultDownload: DownloadState = {
    progress: 0,
    currentState: DownloadCurrentState.NONE,
    authCompleted: false,
    ready: false
  }

  if (!isElectron()) {
    return state || defaultDownload
  }

  state = state || defaultDownload

  if (action.type === SET_DOWNLOAD_PROGRESS) {
    state = { ...state, progress: action.payload.progress, currentState: DownloadCurrentState.DOWNLOADING }
  } else if (action.type === SET_DOWNLOAD_READY) {
    state = { ...state, progress: action.payload.progress, currentState: DownloadCurrentState.READY }
  } else if (action.type === SET_DOWNLOAD_NEW_VERSION) {
    state = { ...state, progress: action.payload.progress, currentState: DownloadCurrentState.NEW_VERSION }
  }

  if (action.type === SET_KERNEL_ACCOUNT_STATE) {
    if (action.payload.loginStatus === LoginState.WAITING_RENDERER) {
      state = { ...state, authCompleted: true }
    }
  }

  if (state.authCompleted && state.currentState === DownloadCurrentState.READY) {
    const ipcRenderer = (window as any).electron.ipcRenderer
    ipcRenderer.send('executeProcess')
    state = { ...state, currentState: DownloadCurrentState.EXECUTED, ready: true }
  }

  return state
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
