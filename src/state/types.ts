import { FeatureFlagsState } from "./redux"

export const FF_APPLICATION_NAME = 'explorer'
export const FF_DAPPS_APPLICATION_NAME = 'dapps'

export const defaultFeatureFlagsState: FeatureFlagsState = {
  flags: {},
  variants: {}
}
