import { action } from 'typesafe-actions'
import { KernelAccountState, KernelError, KernelLoadingProgress, KernelResult } from '@dcl/kernel-interface'
import { BannerType } from './redux'
import { FeatureFlagsResult } from '@dcl/feature-flags'

export const SET_KERNEL_ACCOUNT_STATE = 'Set kernel account state'
export const SET_KERNEL_ERROR = 'Set kernel error'
export const SET_KERNEL_LOADED = 'Set kernel loaded'
export const SET_BANNER = 'Set banner'

export const SET_RENDERER_LOADING = 'Set renderer loading'
export const SET_RENDERER_READY = 'Set renderer ready'
export const SET_RENDERER_VISIBLE = 'Set renderer visible'

export const SET_CATALYST_AS_TRUSTED = 'Set catalyst as trusted'

export const SET_FEATURE_FLAGS = 'Set feature flags'

export const setKernelAccountState = (accountState: KernelAccountState) =>
  action(SET_KERNEL_ACCOUNT_STATE, accountState)
export const setKernelError = (error: KernelError | null) => action(SET_KERNEL_ERROR, error)
export const setKernelLoaded = (kernel: KernelResult) => action(SET_KERNEL_LOADED, kernel)
export const setCatalystAsTrusted = () => action(SET_CATALYST_AS_TRUSTED)
export const setRendererLoading = (progressEvent: KernelLoadingProgress) => action(SET_RENDERER_LOADING, progressEvent)
export const setRendererReady = (ready: boolean) => action(SET_RENDERER_READY, { ready })
export const setRendererVisible = (visible: boolean) => action(SET_RENDERER_VISIBLE, { visible })
export const setBanner = (banner: BannerType | null) => action(SET_BANNER, { banner })

export const setFeatureFlags = (result: FeatureFlagsResult) => action(SET_FEATURE_FLAGS, result)
