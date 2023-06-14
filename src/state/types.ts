import { FeatureFlagsState } from "./redux"

export const defaultFeatureFlagsState: FeatureFlagsState = {
  ready: false,
  flags: {},
  variants: {}
}
