import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LoginState } from '@dcl/kernel-interface'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { toFeatureList } from '@dcl/feature-flags'
import { connect } from 'react-redux'
import { connection } from 'decentraland-connect/dist/index'
import { Container } from '../common/Layout/Container'
import { StoreType } from '../../state/redux'
import { FeatureFlags, getFeatureVariantName, VariantNames } from '../../state/selectors'
import { authenticate } from '../../kernel-loader'
import { EthWalletSelector } from './EthWalletSelector'
import { EthWalletNewSelector } from './EthWalletNewSelector'
import { LoginGuestItem, LoginWalletItem } from './LoginItemContainer'
import { LoginGuestItemNew, LoginWalletItemNew } from './LoginItemNewContainer'
import LogoContainer from './LogoContainer'
import { DownloadDesktopToast } from '../download/DownloadDesktopToast'
import { DownloadModal } from '../download/DownloadModal'
import { isElectron } from '../../integration/desktop'
import { disconnect } from '../../eth/provider'
import { track } from '../../utils/tracking'
import './LoginContainer.css'
import Main from '../common/Layout/Main'

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
    isSignInFlowV3: getFeatureVariantName(state, FeatureFlags.SignInFlowV3) === VariantNames.New && !isElectron(),
    featureList: toFeatureList(state.featureFlags)
  }
}

enum TrackingActionType {
  SignIn = 'sign_in',
  CreateAccount = 'create_account'
}

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: (providerType: ProviderType | null, action_type?: TrackingActionType) => {
    track('click_login_button', { provider_type: providerType || 'guest', action_type })
    authenticate(providerType)
  },
  onCancelLogin: () => {
    track('click_cancel_login_button')
    disconnect().then(() => window.location.reload())
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
  isSignInFlowV3: boolean
  featureList: string[]
}

export interface LoginContainerDispatch {
  onLogin: (provider: ProviderType | null, action_type?: TrackingActionType) => void
  onCancelLogin: () => void
}

export const LoginContainer: React.FC<LoginContainerProps & LoginContainerDispatch> = ({
  onLogin,
  onCancelLogin,
  stage,
  isWallet,
  isGuest,
  provider,
  kernelReady,
  availableProviders,
  isSignInFlowV3,
  featureList
}) => {
  useEffect(() => {
    track('feature_flags', {
      featureFlags: featureList
    })
  }, [featureList])

  const [showWalletSelector, setShowWalletSelector] = useState<{
    open: boolean
    action_type?: TrackingActionType
  }>({ open: false })
  const handleOpenSelector = useCallback(() => {
    track('open_login_popup')
    setShowWalletSelector({ open: true })
  }, [])

  const handleSignIn = useCallback(() => {
    track('open_login_popup', { action_type: TrackingActionType.SignIn })
    setShowWalletSelector({ open: true, action_type: TrackingActionType.SignIn })
  }, [])

  const handleCreateAccount = useCallback(() => {
    track('open_login_popup', { action_type: TrackingActionType.CreateAccount })
    setShowWalletSelector({ open: true, action_type: TrackingActionType.CreateAccount })
  }, [])

  const handleCloseSelector = useCallback(() => {
    track('close_login_popup')
    setShowWalletSelector({ open: false })
  }, [])

  const [canceling, setCanceling] = useState(false)
  const handleCancelLogin = useCallback(() => {
    if (onCancelLogin) {
      setCanceling(true)
      onCancelLogin()
    }
  }, [onCancelLogin, setCanceling])

  const handleGuestLogin = useCallback(() => onLogin && onLogin(null), [onLogin])

  const handleLogin = useCallback(
    (provider_type: ProviderType) => {
      if (onLogin) {
        onLogin(provider_type, showWalletSelector.action_type)
      }
    },
    [onLogin, showWalletSelector]
  )

  const loading = useMemo(() => {
    return (
      stage === LoginState.SIGNATURE_PENDING ||
      stage === LoginState.WAITING_PROFILE ||
      stage === LoginState.WAITING_RENDERER ||
      stage === LoginState.LOADING ||
      !kernelReady
    )
  }, [stage, kernelReady])

  const providerInUse = useMemo(() => {
    if (stage === LoginState.AUTHENTICATING || stage === LoginState.SIGNATURE_PENDING) {
      return provider
    }

    return undefined
  }, [stage, provider])

  if (stage === LoginState.COMPLETED) {
    return <React.Fragment />
  }

  return (
    <Main withDarkLayer={isSignInFlowV3}>
      {/* {stage === LoginState.CONNECT_ADVICE && <EthConnectAdvice onLogin={onLogin} />} */}
      {/* {stage === LoginState.SIGN_ADVICE && <EthSignAdvice />} */}

      {isSignInFlowV3 && (
        <Container>
          <LogoContainer />
          <div>
            <LoginWalletItemNew
              loading={loading}
              active={isWallet}
              onClick={handleSignIn}
              onCreateAccount={handleCreateAccount}
              provider={providerInUse}
              onCancelLogin={handleCancelLogin}
              canceling={canceling}
            />
            <LoginGuestItemNew loading={loading} active={isGuest} onClick={handleGuestLogin} />
          </div>
          <DownloadDesktopToast />
        </Container>
      )}

      {!isSignInFlowV3 && (
        <Container>
          <LogoContainer />
          <div>
            <LoginWalletItem
              loading={loading}
              active={isWallet}
              onClick={handleOpenSelector}
              provider={providerInUse}
              onCancelLogin={handleCancelLogin}
              canceling={canceling}
            />
            <LoginGuestItem loading={loading} active={isGuest} onClick={handleGuestLogin} />
          </div>
          <DownloadDesktopToast />
        </Container>
      )}

      <EthWalletSelector
        open={showWalletSelector.open && !isSignInFlowV3}
        loading={loading}
        availableProviders={availableProviders || defaultAvailableProviders}
        provider={providerInUse}
        onLogin={onLogin}
        canceling={canceling}
        onCancelLogin={handleCancelLogin}
        onClose={handleCloseSelector}
      />

      <EthWalletNewSelector
        open={showWalletSelector.open && isSignInFlowV3}
        loading={loading}
        availableProviders={availableProviders || defaultAvailableProviders}
        provider={providerInUse}
        onLogin={handleLogin}
        canceling={canceling}
        onCancelLogin={handleCancelLogin}
        onClose={handleCloseSelector}
      />

      {!isElectron() && <DownloadModal />}
    </Main>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
