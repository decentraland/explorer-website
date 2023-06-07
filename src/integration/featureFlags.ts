import { fetchFlags } from '@dcl/feature-flags'
import { FeatureFlagsResult } from '@dcl/feature-flags'
import { connection } from 'decentraland-connect/dist'
import { ProviderType } from '@dcl/schemas'
import { setFeatureFlags } from '../state/actions'
import { store } from '../state/redux'
import { FF_APPLICATION_NAME, FF_DAPPS_APPLICATION_NAME, defaultFeatureFlagsState } from '../state/types'
import { callOnce } from '../utils/callOnce'
import { FeatureFlags, isFeatureEnabled } from '../state/selectors'

/**
 * Fetches feature flags from the server and stores them in the redux store.
 */
export const initializeFeatureFlags = callOnce(async () => {
  let ff = defaultFeatureFlagsState as FeatureFlagsResult

  try {
    // Get explorer feature flags.
    const ffExplorer = await fetchFlags({ applicationName: FF_APPLICATION_NAME })
    // Get dapps feature flags.
    const ffDapps = await fetchFlags({ applicationName: FF_DAPPS_APPLICATION_NAME })

    // Merge both the explorer and dapps feature flags into a single object.
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
 * This is done to prevent a user to keep using a wallet that will not / is not supported anymore.
 * Also to be able to easily rollback in case WC2 has too many flaws.
 * Once WC2 becomes the only supported WC version, this function can be removed.
 */
export async function handleWalletConnectConnection() {
  const connectionData = connection.getConnectionData()

  // No connection data means the user has not connected on a previous session.
  // Could also mean it has disconnected manually from the previous session.
  if (!connectionData) {
    return
  }

  const isWalletConnectV2Enabled = isFeatureEnabled(
    store.getState(),
    FeatureFlags.WalletConnectV2,
    FF_DAPPS_APPLICATION_NAME
  )

  const { providerType } = connectionData

  // Disconnect the user only if it has connected previously with a WC version different than the one defined in the feature flags.
  if (
    (providerType === ProviderType.WALLET_CONNECT && isWalletConnectV2Enabled) ||
    (providerType === ProviderType.WALLET_CONNECT_V2 && !isWalletConnectV2Enabled)
  ) {
    await connection.disconnect()
  }
}
