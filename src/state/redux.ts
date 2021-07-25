import { combineReducers, createStore } from 'redux'
import { KernelAccountState, KernelResult, KernelLoadingProgress} from '@dcl/kernel-interface'
import { kernelReducer, sessionReducer, rendererReducer, errorReducer, featureFlagsReducer } from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

export type KernelState = {
  ready: boolean
  kernel: KernelResult | null
}

export type RendererState = {
  ready: boolean
  version: string
  visible: boolean
  loading: KernelLoadingProgress | null
}

export type FeatureFlags = {
  sessionId: string
}

export type SessionState = {
  kernelState: KernelAccountState | null
}

export type ErrorState = {
  type: ErrorType
  details: string
}

export enum ErrorType {
  LOADING = 'loading',
  FATAL = 'fatal',
  COMMS = 'comms',
  NEW_LOGIN = 'newlogin',
  NOT_MOBILE = 'nomobile',
  NOT_INVITED = 'notinvited',
  NOT_SUPPORTED = 'notsupported',
  NET_MISMATCH = 'networkmismatch',
  AVATAR_ERROR = 'avatarerror'
}

export type StoreType = {
  kernel: KernelState
  renderer: RendererState
  session: SessionState
  featureFlags: FeatureFlags
  error: ErrorState | null
}

const reducers = combineReducers<StoreType>({
  kernel: kernelReducer,
  session: sessionReducer,
  renderer: rendererReducer,
  featureFlags: featureFlagsReducer,
  error: errorReducer
})

const middleware: typeof composeWithDevTools =
  process.env.NODE_ENV !== 'production' ? composeWithDevTools : (x: any) => x

export const store = createStore(reducers, {}, middleware())
