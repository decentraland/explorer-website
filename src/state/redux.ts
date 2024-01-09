import { combineReducers, createStore } from 'redux'
import type { KernelAccountState, KernelResult, KernelLoadingProgress } from '@dcl/kernel-interface'
import type { FeatureFlagsResult } from '@dcl/feature-flags'
import { kernelReducer, sessionReducer, rendererReducer, errorReducer, bannerReducer, downloadReducer, featureFlagsReducer, catalystReducer, decktopReducer } from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ConnectionData } from 'decentraland-connect/dist/types'

export type DesktopState = {
  detected: boolean
}

export type KernelState = {
  ready: boolean
  kernel: KernelResult | null
}

export type RendererState = {
  ready: boolean
  visible: boolean
  version: string
  loading: KernelLoadingProgress | null
}

export type CatalystState = {
  catalyst: string | null
  trusted: boolean
}

export type SessionState = {
  // It is important that this ID is autogenerated in every user session (reload)
  // and it _never_ changes during the session
  sessionId: string
  kernelState: KernelAccountState | null
  connection: ConnectionData | null
  ready: boolean
}

export type ErrorState = {
  error: {
    type: string | ErrorType
    details: string
    extra?: Record<string, any>
  } | null
}

export enum ErrorType {
  LOADING = 'loading',
  FATAL = 'fatal',
  COMMS = 'comms',
  NEW_LOGIN = 'newlogin',
  NOT_MOBILE = 'nomobile',
  NOT_SUPPORTED = 'notsupported',
  NET_MISMATCH = 'networkmismatch',
  AVATAR_ERROR = 'avatarerror',
  METAMASK_LOCKED = 'METAMASK_LOCKED'
}

export type BannerState = {
  banner: BannerType | null
}

export enum BannerType {
  NOT_RECOMMENDED = 'notrecommended',
}

export enum DownloadCurrentState {
  NONE = 'none',
  NEW_VERSION = 'new_version',
  DOWNLOADING = 'downloading',
  READY = 'ready',
  EXECUTED = 'executed'
}

export type DownloadState = {
  currentState: DownloadCurrentState
  progress: number
  authCompleted: boolean
  ready: boolean
}

export type FeatureFlagsState = FeatureFlagsResult & {
  ready: boolean
}

export type StoreType = {
  desktop: DesktopState
  kernel: KernelState
  renderer: RendererState
  catalyst: CatalystState
  session: SessionState
  error: ErrorState
  banner: BannerState
  download: DownloadState
  featureFlags: FeatureFlagsState
}

const reducers = combineReducers<StoreType>({
  desktop: decktopReducer,
  kernel: kernelReducer,
  session: sessionReducer,
  renderer: rendererReducer,
  catalyst: catalystReducer,
  error: errorReducer,
  banner: bannerReducer,
  download: downloadReducer,
  featureFlags: featureFlagsReducer,
})

const middleware: typeof composeWithDevTools =
  process.env.NODE_ENV !== 'production' ? composeWithDevTools : (x: any) => x

export const store = createStore(reducers, {}, middleware())
