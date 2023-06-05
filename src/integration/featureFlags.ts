import { fetchFlags } from '@dcl/feature-flags'
import { FeatureFlagsResult } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, FF_DAPPS_APPLICATION_NAME } from '../state/types'
import { callOnce } from '../utils/callOnce'

export const initializeFeatureFlags = callOnce(async () => {
  const ff = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
  const ffDapps = await fetchFlags({ applicationName: FF_DAPPS_APPLICATION_NAME })
  const ffMerged: FeatureFlagsResult = {
    flags: { ...ff.flags, ...ffDapps.flags },
    variants: { ...ff.variants, ...ffDapps.variants },
    error: ff.error || ffDapps.error
  }

  store.dispatch(setFeatureFlags(ffMerged))
})
