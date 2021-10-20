import { BrowserState, FeatureFlagsState } from "./redux"

export const FF_APPLICATION_NAME = 'explorer'

export const defaultFeatureFlagsState: FeatureFlagsState = {
  flags: {},
  variants: {}
}

export const defaultBrowserState: BrowserState = {
  width: 990,
  height: 990
}