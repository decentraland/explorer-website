import { fetchFlags } from '@dcl/feature-flags'
import { FeatureFlagsResult } from '@dcl/feature-flags'
import { connection } from 'decentraland-connect/dist'
import { ProviderType } from '@dcl/schemas'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, FF_DAPPS_APPLICATION_NAME, defaultFeatureFlagsState } from '../state/types'
import { callOnce } from '../utils/callOnce'
import { FeatureFlags, isFeatureEnabled } from '../state/selectors'

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

  handleWalletConnectConnection()

  return ff
})

/**
 * Disconnects the user when connected with a WalletConnect Version that is not the one defined in the feature flags.
 */
export async function handleWalletConnectConnection() {
  const connectionData = connection.getConnectionData()

  if (!connectionData) {
    return
  }

  const isWalletConnectV2Enabled = isFeatureEnabled(
    store.getState(),
    FeatureFlags.WalletConnectV2,
    FF_DAPPS_APPLICATION_NAME
  )

  const { providerType } = connectionData

  if (
    (providerType === ProviderType.WALLET_CONNECT && isWalletConnectV2Enabled) ||
    (providerType === ProviderType.WALLET_CONNECT_V2 && !isWalletConnectV2Enabled)
  ) {
    await connection.disconnect()
  }
}
