import { FeatureFlagsResult, fetchFlags } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, defaultFeatureFlagsState } from '../state/types'
import { callOnce } from "../utils/callOnce"

export const initializeFeatureFlags = callOnce(async () => {
  const ff = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
    .catch(err => {
      console.error('Error fetching feature flags', err)
      return defaultFeatureFlagsState as FeatureFlagsResult
    })

  store.dispatch(setFeatureFlags(ff))
  return ff
})