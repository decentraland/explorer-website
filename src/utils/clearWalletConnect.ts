import { ProviderType } from '@dcl/schemas'

const DCL_CONNECT_STORAGE_KEY = 'decentraland-connect-storage-key'
const WC_STORAGE_KEY = 'walletconnect'

export function clearWalletConnect() {
  try {
    // Remove data created and stored by wallet connect which tracks the wallet that has connected before.
    // Removing this will show the QR code to connect even if the user has the wallet already connected.
    localStorage.removeItem(WC_STORAGE_KEY)

    // Remove dcl connect stored data only if the provider is wallet connect.
    // Removing this will prevent showing the QR code automatically on init if the user connected to the app
    // with wallet connect previously.
    const connectData = localStorage.getItem(DCL_CONNECT_STORAGE_KEY)

    if (connectData) {
      const json = JSON.parse(connectData)

      if (json.providerType === ProviderType.WALLET_CONNECT) {
        localStorage.removeItem(DCL_CONNECT_STORAGE_KEY)
      }
    }
  } catch (e) {
    // Failed to clear data
  }
}
