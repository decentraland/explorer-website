import React from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import guest from '../../images/guest.jpg'
import wallets from '../../images/wallets.jpg'
import './LoginItemContainer.css'
import { EthConnectAdvice } from './EthConnectAdvice'

export type LoginItemContainerProps = {
  onClick?: () => void,
  className?: string
  loading?: boolean
  active?: boolean
  provider?: ProviderType
  children?: React.ReactNode
}

export const LoginItemContainer = React.memo(function ({ children, className, loading, active, provider, onClick }: LoginItemContainerProps) {
  return <div
      className={`LoginItemContainer ${className || ''} ${loading ? 'loading' : ''} ${active ? 'active' : ''}`}
      onClick={loading ? undefined : onClick}
    >
    <div className="LoginItemContainer__BackLayer" />
    <div className="LoginItemContainer__Content">
      {children}
    </div>
    {loading && active && <div className="loader-background">
      <EthConnectAdvice provider={provider} />
    </div>}
    <Loader active={active && loading} provider={provider} size="massive" />
  </div>
})

export const LoginWalletItem = React.memo(function (props: LoginItemContainerProps) {
  return <LoginItemContainer {...props} className={`LoginWalletItem ${props.className || ''}`}>
      <img alt="wallets" src={wallets} width="318" height="318" />
      <h2>Play using your wallet</h2>
      <p>Connect your account to fully enjoy Decentraland!</p>
      <Button primary size="huge" loading={props.loading && !props.active} disabled={props.loading}>Continue with wallet</Button>
  </LoginItemContainer>
})

export const LoginGuestItem = React.memo(function (props: LoginItemContainerProps) {
  return <LoginItemContainer {...props} className={`LoginGuestItem ${props.className || ''}`}>
    <img alt="guest" src={guest} width="318" height="318" />
    <h2>Play as guest</h2>
    <p>Your information will be locally stored and your experience limited.</p>
    <Button primary size="huge" loading={props.loading && !props.active} disabled={props.loading}>Continue as guest</Button>
  </LoginItemContainer>
})