import React from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import guest from '../../images/guest.jpg'
import wallets from '../../images/wallet-img.png'
import { EthConnectAdvice } from './EthConnectAdvice'
import './LoginItemContainer.css'

export type LoginItemContainerProps = {
  onClick?: () => void,
  onCancelLogin?: () => void,
  className?: string
  loading?: boolean
  canceling?: boolean
  active?: boolean
  provider?: ProviderType
  children?: React.ReactNode
}

export const LoginItemContainer = React.memo(
  ({ children, className, loading, canceling, active, provider, onClick, onCancelLogin }: LoginItemContainerProps) => (
    <div
      className={`LoginItemContainer ${className || ''} ${loading ? 'loading' : ''} ${active ? 'active' : ''}`}
      onClick={loading ? undefined : onClick}
    >
      <div className="LoginItemContainer__BackLayer" />
      <div className="LoginItemContainer__Content">{children}</div>
      {loading && active && (
        <div className="loader-background">
          <Loader active={active && loading} provider={provider} size="massive" />
          {provider && <EthConnectAdvice provider={provider} style={{ marginTop: '27px' }} />}
          {onCancelLogin && provider && <div style={{ marginTop: '22px' }}>- or -</div>}
          {onCancelLogin && provider && (
            <Button onClick={onCancelLogin} loading={canceling} style={{ marginTop: '28px' }}>
              cancel
            </Button>
          )}
        </div>
      )}
    </div>
  )
)

export const LoginWalletItem = React.memo((props: LoginItemContainerProps) => (
  <LoginItemContainer {...props} className={`LoginWalletItem ${props.className || ''}`}>
    <img alt="wallets" src={wallets} width="318" className="wallet-img" />
    <h2>Play using your wallet</h2>
    <p>Connect your account to fully enjoy Decentraland!</p>
    <Button
      primary
      size="huge"
      loading={(props.loading || props.canceling) && !props.active}
      disabled={props.loading || props.canceling}
    >
      Continue with wallet
    </Button>
  </LoginItemContainer>
))

export const LoginGuestItem = React.memo((props: LoginItemContainerProps) => (
  <LoginItemContainer {...props} className={`LoginGuestItem ${props.className || ''}`}>
    <img alt="guest" src={guest} width="318" height="318" />
    <h2>Play as guest</h2>
    <p>Your information will be locally stored and your experience limited.</p>
    <Button
      primary
      size="huge"
      loading={(props.loading || props.canceling) && !props.active}
      disabled={props.loading || props.canceling}
    >
      Continue as guest
    </Button>
  </LoginItemContainer>
))