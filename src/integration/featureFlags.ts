import { fetchFlags } from '@dcl/feature-flags'
import { FeatureFlagsResult } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { defaultFeatureFlagsState } from '../state/types'
import { callOnce } from '../utils/callOnce'

/**
 * Fetches feature flags from the server and stores them in the redux store.
 */
export const initializeFeatureFlags = callOnce(async () => {
  let ff = defaultFeatureFlagsState as FeatureFlagsResult

  try {
    ff = await fetchFlags({ applicationName: ['explorer'] })
  } catch (err) {
    console.error('Error fetching feature flags', err)
  }

  store.dispatch(setFeatureFlags(ff))

  return ff
})
