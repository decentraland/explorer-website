import React, { useCallback, useMemo } from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { isCucumberProvider, isDapperProvider } from 'decentraland-dapps/dist/lib/eth'
import { LoginModal, LoginModalOptionType } from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { isElectron } from '../../integration/desktop'

export interface WalletSelectorProps {
  open: boolean
  loading: boolean
  availableProviders: ProviderType[]
  onLogin: (provider: ProviderType | null) => void
  onCancel: () => void
}

export const EthWalletSelector: React.FC<WalletSelectorProps> = React.memo(({
  open,
  loading,
  availableProviders,
  onLogin,
  onCancel
}) => {
  const anchor = useMemo(() => {
    const a = document.createElement('a')
    a.target = '_blank'
    a.rel = 'noreferrer noopener'
    a.href = 'https://metamask.io/download.html'
    return a
  }, [])

  const browserWallet = useMemo<LoginModalOptionType | null>(() => {
    if (availableProviders.length > 0) {
      const hasWallet = availableProviders.includes(ProviderType.INJECTED)
      if (hasWallet) {
        return isCucumberProvider() ? LoginModalOptionType.SAMSUNG :
          isDapperProvider() ? LoginModalOptionType.DAPPER :
          LoginModalOptionType.METAMASK
      }
    }

    return null
  }, [ availableProviders ])

  const handleLoginWalletConnect = useCallback(() => onLogin(ProviderType.WALLET_CONNECT), [ onLogin ])
  const handleLoginFortmatic = useCallback(() => onLogin(ProviderType.FORTMATIC), [ onLogin ])
  const handleLoginInjected = useCallback(() => {
    if (browserWallet && onLogin) {
      onLogin(ProviderType.INJECTED)
    } else {
      anchor.click()
    }
  }, [ onLogin,browserWallet, anchor ])

  return <LoginModal
    open={open}
    loading={loading}
    onClose={onCancel}
    i18n={{
      title: 'Connect your wallet',
      error: '',
      subtitle: ''
    }}
  >
      {!isElectron() && <LoginModal.Option type={browserWallet || LoginModalOptionType.METAMASK} onClick={handleLoginInjected} />}
      <LoginModal.Option type={LoginModalOptionType.FORTMATIC} onClick={handleLoginFortmatic} />
      <LoginModal.Option type={LoginModalOptionType.WALLET_CONNECT} onClick={handleLoginWalletConnect}  />
      <small className="message">Trezor and smart contract wallets like Dapper, Argent or Gnosis safe, do not work with Polygon. Read more about the Trezor support status
        {' '}
        <a
          href="https://github.com/trezor/trezor-firmware/pull/1568"
          target="_blank"
          rel="noopener noreferrer">
          {'here'}
        </a>.
      </small>
    </LoginModal>
})
