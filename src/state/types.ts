import { FeatureFlagsState } from "./redux"

export const FF_APPLICATION_NAME = 'explorer'

export const defaultFeatureFlagsState: FeatureFlagsState = {
  flags: {},
  variants: {}
}
