import React, { useCallback } from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import SelectionLabel from "semantic-ui-react/dist/commonjs/elements/Label"
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import { EthConnectAdvice } from './EthConnectAdvice'
import './LoginItemNewContainer.css'

export type LoginItemNewContainerProps = {
  onClick?: () => void
  onCancelLogin?: () => void
  onCreateAccount?: () => void
  className?: string
  loading?: boolean
  canceling?: boolean
  active?: boolean
  animate?: boolean
  provider?: ProviderType
  children?: React.ReactNode
}

export const LoginItemNewContainer = React.memo(
  ({
    children,
    className,
    loading,
    canceling,
    active,
    provider,
    animate,
    onClick,
    onCancelLogin
  }: LoginItemNewContainerProps) => (
    <div
      className={`LoginItemNewContainer ${className || ''} ${loading ? 'loading' : ''}  ${animate ? 'animate' : ''} ${
        active ? 'active' : ''
      }`}
      onClick={loading ? undefined : onClick}
    >
      {animate && <div className="LoginItemNewContainer__BackLayer" />}
      <div className="LoginItemNewContainer__Content">{children}</div>
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

export const LoginWalletItemNew = React.memo(function (props: LoginItemNewContainerProps) {
  
  const handleCreateAccount = useCallback((event: React.MouseEvent<HTMLButtonElement>)=> {
    if(props.onCreateAccount) {
      event.stopPropagation()
      props.onCreateAccount()
    }
  }, [props])

  return (
    <LoginItemNewContainer {...props} className={`LoginWalletItem ${props.className || ''}`}>
      <h2>
        Create an account or
        <br />
        sign in
      </h2>
      <div className="LoginWalletItem__SuccessLabelWrapper">
        <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
          <Icon className={'LoginWalletItem__SuccessLabelIcon'} name="check" />
          <span>Free to play</span>
        </SelectionLabel>
        <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
          <Icon className={'LoginWalletItem__SuccessLabelIcon'} name="check" />
          <span>Play on multiple devices</span>
        </SelectionLabel>
        <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
          <Icon className={'LoginWalletItem__SuccessLabelIcon'} name="check" />
          <span>Friends and private chat</span>
        </SelectionLabel>
        <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
          <Icon className={'LoginWalletItem__SuccessLabelIcon'} name="check" />
          <span>Buy, trade and earn NFTs</span>
        </SelectionLabel>
      </div>

      <Button
        secondary
        loading={(props.loading || props.canceling) && !props.active}
        disabled={props.loading || props.canceling}
      >
        SIGN IN
      </Button>

      <Button
        primary
        loading={(props.loading || props.canceling) && !props.active}
        disabled={props.loading || props.canceling}
        onClick={handleCreateAccount}
      >
        CREATE AN ACCOUNT
      </Button>
    </LoginItemNewContainer>
  )
})

export const LoginGuestItemNew = React.memo((props: LoginItemNewContainerProps) => (
  <LoginItemNewContainer {...props} className={`LoginGuestItem ${props.className || ''}`}>
    <h2>Play as guest</h2>

    <div className="LoginWalletItem__SuccessLabelWrapper">
      <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
        <Icon className={'LoginWalletItem__SuccessLabelIcon'} name="check" />
        <span>Free to play</span>
      </SelectionLabel>
      <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
        <span>Information stored locally</span>
      </SelectionLabel>
      <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
        <span>Limited social features</span>
      </SelectionLabel>
      <SelectionLabel className={'LoginWalletItem__SuccessLabel'}>
        <span>Cannot receive NFTs</span>
      </SelectionLabel>
    </div>

    <Button
      secondary
      loading={(props.loading || props.canceling) && !props.active}
      disabled={props.loading || props.canceling}
    >
      PLAY AS A GUEST
    </Button>
  </LoginItemNewContainer>
))
