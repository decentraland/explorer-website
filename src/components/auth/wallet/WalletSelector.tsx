import React, { useCallback, useMemo } from 'react'
import { ProviderType } from 'decentraland-connect'
import { isCucumberProvider, isDapperProvider } from 'decentraland-dapps/dist/lib/eth'
import { LoginModal, LoginModalOptionType } from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { isElectron } from '../../../integration/desktop'
import './WalletSelector.css'

export interface WalletSelectorProps {
  open: boolean
  loading: boolean
  availableProviders: ProviderType[]
  onLogin: (provider: ProviderType | null) => void
  onCancel: () => void
}

export const WalletSelector: React.FC<WalletSelectorProps> = React.memo(({
  open,
  loading,
  availableProviders,
  onLogin,
  onCancel
}) => {
  const browserWallet = useMemo<LoginModalOptionType | null>(() => {
    if (!isElectron() && availableProviders.length > 0) {
      const hasWallet = availableProviders.includes(ProviderType.INJECTED)
      if (hasWallet) {
        return isCucumberProvider() ? LoginModalOptionType.SAMSUNG :
          isDapperProvider() ? LoginModalOptionType.DAPPER :
          LoginModalOptionType.METAMASK
      }
    }

    return null
  }, [ availableProviders ])

  const handleLoginInjected = useCallback(() => onLogin(ProviderType.INJECTED), [ onLogin ])
  const handleLoginFortmatic = useCallback(() => onLogin(ProviderType.FORTMATIC), [ onLogin ])
  const handleLoginWalletConnect = useCallback(() => onLogin(ProviderType.WALLET_CONNECT), [ onLogin ])


  return <LoginModal open={open} loading={loading} onClose={onCancel}>
      {browserWallet && <LoginModal.Option type={browserWallet} onClick={handleLoginInjected} />}
      <LoginModal.Option type={LoginModalOptionType.FORTMATIC} onClick={handleLoginFortmatic} />
      <LoginModal.Option type={LoginModalOptionType.WALLET_CONNECT} onClick={handleLoginWalletConnect}  />
      <small className="message">Trezor and smart contract wallets like Dapper, Argent or Gnosis safe, do not work with Polygon. Read more about the Trezor support status
        <a
          href="https://github.com/trezor/trezor-firmware/pull/1568"
          target="_blank"
          rel="noopener noreferrer">
          {' here'}
        </a>
      </small>
    </LoginModal>
})
