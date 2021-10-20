import { fetchFlags } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME } from '../state/types'
import { callOnce } from "../utils/callOnce"

export const initializeFeatureFlags = callOnce(async () => {
  const ff = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
  store.dispatch(setFeatureFlags(ff))
})