import React, { useCallback, useMemo, useState } from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { isCucumberProvider, isDapperProvider } from 'decentraland-dapps/dist/lib/eth'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { LoginModal, LoginModalOptionType } from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { track } from '../../utils/tracking'
import { EthConnectAdvice } from './EthConnectAdvice'
import './EthWalletNewSelector.css'

export interface WalletSelectorProps {
  open: boolean
  loading: boolean
  canceling?: boolean
  provider?: ProviderType
  availableProviders?: ProviderType[]
  onLogin: (provider: ProviderType) => void
  onCancelLogin?: () => void
  onClose?: () => void
}

export const EthWalletNewSelector: React.FC<WalletSelectorProps> = React.memo(
  ({ open, loading, canceling, provider, availableProviders, onLogin, onCancelLogin, onClose }) => {
    const anchor = useMemo(() => {
      const a = document.createElement('a')
      a.target = '_blank'
      a.rel = 'noreferrer noopener'
      a.href = 'https://metamask.io/download.html'
      return a
    }, [])

    const [showIncompatible, setShowIncompatible] = useState(false)

    const browserWallet = useMemo<LoginModalOptionType | null>(() => {
      if (availableProviders && availableProviders.length > 0) {
        const hasWallet = availableProviders.includes(ProviderType.INJECTED)
        if (hasWallet) {
          return isCucumberProvider()
            ? LoginModalOptionType.SAMSUNG
            : isDapperProvider()
            ? LoginModalOptionType.DAPPER
            : LoginModalOptionType.METAMASK
        }
      }

      return null
    }, [availableProviders])

    const handleLoginWalletConnect = useCallback(() => onLogin(ProviderType.WALLET_CONNECT), [onLogin])
    const handleLoginWalletLink = useCallback(() => onLogin(ProviderType.WALLET_LINK), [onLogin])
    const handleLoginFortmatic = useCallback(() => onLogin(ProviderType.FORTMATIC), [onLogin])
    const handleLoginInjected = useCallback(() => {
      if (browserWallet) {
        onLogin(ProviderType.INJECTED)
      } else {
        anchor.click()
      }
    }, [onLogin, browserWallet, anchor])
    const handleIncompatible = useCallback(() => {
      track('click_incompatible_wallet')
      setShowIncompatible(true)
    }, [])

    return (
      <>
        <LoginModal
          open={open}
          onClose={() => {
            setShowIncompatible(false)
            onClose && onClose()
          }}
          i18n={{
            title: showIncompatible ? 'Create a Web3 wallet' : 'Create an account or sign in',
            subtitle: showIncompatible ? (
              <span>
                Don’t have a compatible wallet? Don’t worry, creating one is <b>easy and free</b>. Choose one of the
                providers below to start.
              </span>
            ) : (
              <span>
                Connect with one of our supported <b>Web3 wallet</b> providers to get started.
              </span>
            ),
            error: ''
          }}
          className="login-new-modal"
        >
          <LoginModal.Option type={browserWallet || LoginModalOptionType.METAMASK} onClick={handleLoginInjected} />
          <LoginModal.Option type={LoginModalOptionType.FORTMATIC} onClick={handleLoginFortmatic} />
          {!showIncompatible && (
            <LoginModal.Option type={LoginModalOptionType.WALLET_CONNECT} onClick={handleLoginWalletConnect} />
          )}
          {!showIncompatible && (
            <LoginModal.Option type={LoginModalOptionType.WALLET_LINK} onClick={handleLoginWalletLink} />
          )}
          {!showIncompatible && (
            <div className="dcl option incompatible" onClick={handleIncompatible}>
              <div className="image"></div>
              <div className="info">
                <div className="title">I don't have a compatible wallet</div>
              </div>
            </div>
          )}
          {loading && (
            <div className="loader-background">
              <Loader active={loading} provider={provider} size="massive" />
              <EthConnectAdvice provider={provider} style={{ marginTop: '27px' }} />
              <div className="loader-background__or-separator">- or -</div>
              <Button
                onClick={onCancelLogin}
                loading={canceling}
                disabled={canceling}
                className="loader-background__button"
              >
                CANCEL LOGIN
              </Button>
            </div>
          )}

          {showIncompatible && (
            <div className="login-new-modal__incompatible-description">
              <h2>FAQ</h2>
              <h3>What is a Web3 wallet?</h3>
              <p>A Web3 wallet is a type of crypto wallet. It stores cryptocurrency and NFTs.</p>
              <h3>Why do I need a Web3 wallet?</h3>
              <p>
                Your wallet is your Decentraland account. It stores your digital assets and progress and lets you
                connect from more than one device.
              </p>
              <h3>Do I need to pay?</h3>
              <p>No, it is free to create a wallet and Decentraland is free to use.</p>
            </div>
          )}
        </LoginModal>
      </>
    )
  }
)
