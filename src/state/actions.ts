import { action } from 'typesafe-actions'
import {
  IEthereumProvider,
  KernelAccountState,
  KernelError,
  KernelLoadingProgress,
  KernelResult
} from '@dcl/kernel-interface'
import { BannerType } from './redux'

export const KERNEL_AUTHENTICATE = '[Authenticate]'
export const SET_KERNEL_ACCOUNT_STATE = 'Set kernel account state'
export const SET_KERNEL_ERROR = 'Set kernel error'
export const SET_KERNEL_LOADED = 'Set kernel loaded'
export const SET_RENDERER_LOADING = 'Set renderer loading'
export const SET_RENDERER_VISIBLE = 'Set renderer visible'
export const SET_BANNER = 'Set banenr'

export const setKernelAccountState = (accountState: KernelAccountState) =>
  action(SET_KERNEL_ACCOUNT_STATE, accountState)
export const setKernelError = (error: KernelError | null) => action(SET_KERNEL_ERROR, error)
export const setKernelLoaded = (kernel: KernelResult) => action(SET_KERNEL_LOADED, kernel)
export const setRendererLoading = (progressEvent: KernelLoadingProgress) => action(SET_RENDERER_LOADING, progressEvent)
export const setRendererVisible = (visible: boolean) => action(SET_RENDERER_VISIBLE, { visible })
export const setBanner = (banner: BannerType | null) => action(SET_BANNER, { banner })

export const authenticate = (provider: IEthereumProvider, isGuest: boolean) =>
  action(KERNEL_AUTHENTICATE, { provider, isGuest })
