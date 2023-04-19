import { FeatureFlagsResult, fetchFlags } from '@dcl/feature-flags'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, FF_DAPPS_APPLICATION_NAME } from '../state/types'
import { callOnce } from '../utils/callOnce'

export const initializeFeatureFlags = callOnce(async () => {
  const ffExplorer = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
  // Fetch dapps feature flags and convert them to explorer feature flags to prevent updating selectors.
  // This is required for cases such as integrating WCv2 which is a dapps ff, not only an explorer one.
  const ffDapps = normalize(await fetchFlags({ applicationName: FF_DAPPS_APPLICATION_NAME }))

  verifyRepetitions(ffExplorer, ffDapps)

  // Merge both results.
  const ff: FeatureFlagsResult = {
    flags: {
      ...ffExplorer.flags,
      ...ffDapps.flags
    },
    variants: {
      ...ffExplorer.variants,
      ...ffDapps.variants
    },
    error: ffExplorer.error || ffDapps.error
  }

  store.dispatch(setFeatureFlags(ff))
})

/**
 * Checks that there are no keys in common between the two results.
 * This is to prevent overriding feature flags.
 */
function verifyRepetitions(result1: FeatureFlagsResult, result2: FeatureFlagsResult) {
  verifyRepetitionsBetweenRecords(result1.flags, result2.flags)
  verifyRepetitionsBetweenRecords(result1.variants, result2.variants)
}

/**
 * Checks that there are no keys in common between the two records.
 */
function verifyRepetitionsBetweenRecords(record1: Record<string, any>, record2: Record<string, any>) {
  for (const key in record1) {
    if (record2[key]) {
      throw new Error(`Key ${key} found in both records`)
    }
  }
}

/**
 * Updates `dapps-` ff results to `explorer-` ff results.
 */
function normalize(result: FeatureFlagsResult): FeatureFlagsResult {
  return {
    flags: normalizeRecord(result.flags),
    variants: normalizeRecord(result.variants),
    error: result.error
  }
}

/**
 * Updates `dapps-` ff keys to `explorer-` ff keys in a record.
 */
function normalizeRecord<T>(record: Record<string, T>): Record<string, T> {
  const pattern = new RegExp(`^${FF_DAPPS_APPLICATION_NAME}`)

  const result: Record<string, T> = {}

  for (const key in record) {
    result[key.replace(pattern, FF_APPLICATION_NAME)] = record[key]
  }

  return result
}
