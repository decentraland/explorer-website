import { action } from 'typesafe-actions'
import {
  IEthereumProvider,
  KernelAccountState,
  KernelError,
  KernelLoadingProgress,
  KernelResult
} from '@dcl/kernel-interface'
import { BannerType } from './redux'
import { FeatureFlagsResult } from '@dcl/feature-flags'

export const KERNEL_AUTHENTICATE = '[Authenticate]'
export const KERNEL_LOGOUT_REQUEST = '[Logout]'
export const SET_KERNEL_ACCOUNT_STATE = 'Set kernel account state'
export const SET_KERNEL_ERROR = 'Set kernel error'
export const SET_KERNEL_LOADED = 'Set kernel loaded'
export const SET_BANNER = 'Set banenr'

export const SET_RENDERER_LOADING = 'Set renderer loading'
export const SET_RENDERER_READY = 'Set renderer ready'
export const SET_RENDERER_VISIBLE = 'Set renderer visible'

export const SET_DOWNLOAD_PROGRESS = '[DownloadProgress]'
export const SET_DOWNLOAD_READY = '[DownloadReady]'
export const SET_DOWNLOAD_NEW_VERSION = '[DownloadNewVersion]'

export const SET_FEATURE_FLAGS = 'Set feature flags'

export const setKernelAccountState = (accountState: KernelAccountState) =>
  action(SET_KERNEL_ACCOUNT_STATE, accountState)
export const setKernelError = (error: KernelError | null) => action(SET_KERNEL_ERROR, error)
export const setKernelLoaded = (kernel: KernelResult) => action(SET_KERNEL_LOADED, kernel)
export const setRendererLoading = (progressEvent: KernelLoadingProgress) => action(SET_RENDERER_LOADING, progressEvent)
export const setRendererReady = (ready: boolean) => action(SET_RENDERER_READY, { ready })
export const setRendererVisible = (visible: boolean) => action(SET_RENDERER_VISIBLE, { visible })
export const setBanner = (banner: BannerType | null) => action(SET_BANNER, { banner })

export const setDownloadProgress = (progress: number) => action(SET_DOWNLOAD_PROGRESS, { progress })
export const setDownloadReady = () => action(SET_DOWNLOAD_READY, { })
export const setDownloadNewVersion = () => action(SET_DOWNLOAD_NEW_VERSION, { })

export const setFeatureFlags = (result: FeatureFlagsResult) => action(SET_FEATURE_FLAGS, result)

export const authenticate = (provider: IEthereumProvider, isGuest: boolean) =>
  action(KERNEL_AUTHENTICATE, { provider, isGuest })

export const logout = (options: Partial<{reload: boolean }> = {}) => action(KERNEL_LOGOUT_REQUEST, options)