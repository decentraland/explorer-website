import React, { useCallback, useMemo, useState } from 'react'
import { LoginState } from '@dcl/kernel-interface'
import { connect } from 'react-redux'
import { connection } from 'decentraland-connect/dist/index'
import { ProviderType } from 'decentraland-connect/dist/types'
import { Container } from '../common/Container'
import { StoreType } from '../../state/redux'
import { authenticate } from '../../kernel-loader'
import { WalletSelector } from './wallet/WalletSelector'
import { LoginGuestItem, LoginWalletItem } from '../common/LoginItemContainer'
import logo from '../../images/logo.png'
import './LoginContainer.css'
import { isElectron } from '../../integration/desktop'

const mapStateToProps = (state: StoreType): LoginContainerProps => {
  // test all connectors
  const enableProviders = new Set([ProviderType.INJECTED, ProviderType.FORTMATIC, ProviderType.WALLET_CONNECT])
  const availableProviders = connection.getAvailableProviders().filter((provider) => enableProviders.has(provider))
  return {
    stage: state.session.kernelState?.loginStatus,
    availableProviders,
    kernelReady: state.kernel.ready,
    rendererReady: state.renderer.ready
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: (providerType: ProviderType | null) => {
    authenticate(providerType)
  }
})

export interface LoginContainerProps {
  stage?: LoginState
  availableProviders: ProviderType[]
  kernelReady: boolean
  rendererReady: boolean
}

export interface LoginContainerDispatch {
  onLogin: (provider: ProviderType | null) => void
}

export const LoginContainer: React.FC<LoginContainerProps & LoginContainerDispatch> = (props) => {
  const [ showWalletSelector, setShowWalletSelector ] = useState(false)
  const onSelect = useCallback(() => isElectron() ? props.onLogin && props.onLogin(ProviderType.WALLET_CONNECT) : setShowWalletSelector(true), [ props.onLogin, showWalletSelector ])
  const onCancel = useCallback(() => setShowWalletSelector(false), [ showWalletSelector ])
  const onGuest = useCallback(() => props.onLogin && props.onLogin(null), [ props.onLogin ])
  const loading = useMemo(() => {
    return  props.stage === LoginState.SIGNATURE_PENDING ||
    props.stage === LoginState.WAITING_PROFILE ||
    props.stage === LoginState.WAITING_RENDERER ||
    props.stage === LoginState.LOADING ||
    !props.kernelReady
  }, [ props.stage, props.kernelReady ])

  if (props.stage === LoginState.COMPLETED) {
    return <React.Fragment />
  }

  return (
    <main className="LoginContainer">
      <Container>
        {/* <EthLogin availableProviders={props.availableProviders} onLogin={props.onLogin} signing={loading} /> */}
        {/* {isElectron() && <DownloadProgress/> } */}
        {/* {props.stage === LoginState.CONNECT_ADVICE && <EthConnectAdvice onLogin={props.onLogin} />} */}
        {/* {props.stage === LoginState.SIGN_ADVICE && <EthSignAdvice />} */}
        <div className="LogoContainer">
          <img src={logo} height="40" width="212" />
          <p>Sign In or Create an Account</p>
        </div>
        <div>
          <LoginWalletItem loading={loading} onClick={onSelect} />
          <LoginGuestItem loading={loading} onClick={onGuest} />
        </div>
      </Container>

      <WalletSelector
        open={showWalletSelector}
        loading={loading}
        onLogin={props.onLogin}
        availableProviders={props.availableProviders}
        onCancel={onCancel}
      />
    </main>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
