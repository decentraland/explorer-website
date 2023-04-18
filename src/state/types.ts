import { FeatureFlagsState } from "./redux"

export const FF_APPLICATION_NAME = 'explorer'

export const defaultFeatureFlagsState: FeatureFlagsState = {
  flags: {},
  variants: {}
}

export enum FeatureFlags {
  SeamlessLogin = 'seamless_login_variant',
}

export enum ABVariant {
  Enabled = 'enabled',
  Disabled = 'disabled',
}