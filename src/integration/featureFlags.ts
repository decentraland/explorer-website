import { fetchFlags } from '@dcl/feature-flags'
import { FeatureFlagsResult } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, FF_DAPPS_APPLICATION_NAME, defaultFeatureFlagsState } from '../state/types'
import { callOnce } from '../utils/callOnce'

export const initializeFeatureFlags = callOnce(async () => {
  let ff = defaultFeatureFlagsState as FeatureFlagsResult

  try {
    const ffExplorer = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
    const ffDapps = await fetchFlags({ applicationName: FF_DAPPS_APPLICATION_NAME })

    ff = {
      flags: { ...ffExplorer.flags, ...ffDapps.flags },
      variants: { ...ffExplorer.variants, ...ffDapps.variants },
      error: ffExplorer.error || ffDapps.error
    }
  } catch (err) {
    console.error('Error fetching feature flags', err)
  }

  store.dispatch(setFeatureFlags(ff))

  return ff
})
