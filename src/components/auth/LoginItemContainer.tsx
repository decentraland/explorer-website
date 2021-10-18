import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import guest from '../../images/guest.jpg'
import wallets from '../../images/wallets.jpg'
import './LoginItemContainer.css'

export type LoginItemContainerProps = {
  onClick?: () => void,
  className?: string
  loading?: boolean
  children?: React.ReactNode
}

export const LoginItemContainer = React.memo(function ({ children, className, onClick }: LoginItemContainerProps) {
  return <div className={`LoginItemContainer ${className}`} onClick={onClick}>
    <div className="LoginItemContainer__BackgroundLayer" />
    <div className="LoginItemContainer__Content">
      {children}
    </div>
  </div>
})

export const LoginWalletConnectItem = React.memo(function (props: LoginItemContainerProps) {
  return <LoginItemContainer {...props} className={`LoginWalletConnectItem ${props.className}`}>
      <img alt="wallet connect" src={wallets} width="318" height="318" />
      <h2>Play with your wallet</h2>
      <p>Connect your account to fully enjoy Decentraland!</p>
      <Button primary size="huge" loading={props.loading} disabled={props.loading}>Continue with wallet</Button>
  </LoginItemContainer>
})

export const LoginWalletItem = React.memo(function (props: LoginItemContainerProps) {
  return <LoginItemContainer {...props} className={`LoginWalletItem ${props.className}`}>
      <img alt="wallets" src={wallets} width="318" height="318" />
      <h2>Play with your wallet</h2>
      <p>Connect your account to fully enjoy Decentraland!</p>
      <Button primary size="huge" loading={props.loading} disabled={props.loading}>Continue with wallet</Button>
  </LoginItemContainer>
})

export const LoginGuestItem = React.memo(function (props: LoginItemContainerProps) {
  return <LoginItemContainer {...props} className={`LoginGuestItem ${props.className}`}>
    <img alt="guest" src={guest} width="318" height="318" />
    <h2>Play as guest</h2>
    <p>Your information will be locally stored and your experience limited.</p>
    <Button primary size="huge" loading={props.loading} disabled={props.loading}>Continue as guest</Button>
  </LoginItemContainer>
})