import React, { useCallback, useMemo, useState } from 'react'
import { LoginState } from '@dcl/kernel-interface'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { connect } from 'react-redux'
import { connection } from 'decentraland-connect/dist/index'
import { Container } from '../common/Layout/Container'
import { StoreType } from '../../state/redux'
import { authenticate } from '../../kernel-loader'
import { EthWalletSelector } from './EthWalletSelector'
import { LoginGuestItem, LoginWalletItem } from './LoginItemContainer'
import { isElectron } from '../../integration/desktop'
import { isWindows } from '../../integration/browser'
import { track } from '../../utils/tracking'
import logo from '../../images/logo.png'
import './LoginContainer.css'


export const defaultAvailableProviders = []

const mapStateToProps = (state: StoreType): LoginContainerProps => {
  // test all connectors
  const enableProviders = new Set([ProviderType.INJECTED, ProviderType.FORTMATIC, ProviderType.WALLET_CONNECT])
  const availableProviders = connection.getAvailableProviders().filter((provider) => enableProviders.has(provider))
  return {
    availableProviders,
    stage: state.session.kernelState?.loginStatus,
    provider: state.session.connection?.providerType,
    kernelReady: state.kernel.ready,
    rendererReady: state.renderer.ready,
    isGuest: state.session.kernelState ? state.session.kernelState.isGuest : undefined,
    isWallet: state.session.kernelState ? !state.session.kernelState.isGuest && !!state.session.connection : undefined,
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: (providerType: ProviderType | null) => {
    track('click_login_button', { provider_type: providerType || 'guest' })
    authenticate(providerType)
  }
})

export interface LoginContainerProps {
  stage?: LoginState
  provider?: ProviderType
  availableProviders?: ProviderType[]
  kernelReady: boolean
  rendererReady: boolean
  isGuest?: boolean
  isWallet?: boolean
}

export interface LoginContainerDispatch {
  onLogin: (provider: ProviderType | null) => void
}

export const LoginContainer: React.FC<LoginContainerProps & LoginContainerDispatch> = ({ onLogin, stage, isWallet, isGuest, provider, kernelReady, availableProviders }) => {
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const onSelect = useCallback(
    () => {
      if (isElectron() && onLogin) {
        onLogin(ProviderType.WALLET_CONNECT)
      } else {
        track('open_login_popup')
        setShowWalletSelector(true)
      }
    },
    [onLogin]
  )
  const onCancel = useCallback(() => setShowWalletSelector(false), [])
  const onGuest = useCallback(() => onLogin && onLogin(null), [onLogin])
  const loading = useMemo(() => {
    return stage === LoginState.SIGNATURE_PENDING ||
      stage === LoginState.WAITING_PROFILE ||
      stage === LoginState.WAITING_RENDERER ||
      stage === LoginState.LOADING ||
      !kernelReady
  }, [stage, kernelReady])

  const providerInUse = useMemo(() => {
    if (stage === LoginState.AUTHENTICATING || stage === LoginState.SIGNATURE_PENDING) {
      return provider
    }

    return undefined
  }, [stage, provider])

  const desktopAvailable = useMemo(() => !isElectron() && isWindows(), [])

  if (stage === LoginState.COMPLETED) {
    return <React.Fragment />
  }

  return (
    <main className="LoginContainer">
      {/* {stage === LoginState.CONNECT_ADVICE && <EthConnectAdvice onLogin={onLogin} />} */}
      {/* {stage === LoginState.SIGN_ADVICE && <EthSignAdvice />} */}
      <Container>
        <div className="LogoContainer">
          <img alt="decentraland" src={logo} height="40" width="212" />
          <p>Sign In or Create an Account</p>
        </div>
        <div>
          <LoginWalletItem loading={loading} active={isWallet} onClick={onSelect} provider={providerInUse} />
          <LoginGuestItem loading={loading} active={isGuest} onClick={onGuest} />
        </div>
        <div style={{ visibility: desktopAvailable ? 'visible' : 'hidden' }}>
          <a className="DownloadDesktopApp" href="https://decentraland.org/download/" target="_blank" rel="noreferrer noopener">
            Want to play on windows? <span style={{ textDecoration: 'underline' }}>Download the desktop client</span>
          </a>
        </div>
      </Container>

      <EthWalletSelector
        open={showWalletSelector}
        loading={loading}
        availableProviders={availableProviders || defaultAvailableProviders}
        provider={providerInUse}
        onLogin={onLogin}
        onCancel={onCancel}
      />
    </main>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
