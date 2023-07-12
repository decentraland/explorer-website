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
import LogoContainer from './LogoContainer'
import { DownloadDesktopToast } from '../download/DownloadDesktopToast'
import { DownloadModal } from '../download/DownloadModal'
import { isElectron } from '../../integration/desktop'
import { disconnect } from '../../eth/provider'
import { track } from '../../utils/tracking'
import Main from '../common/Layout/Main'
import { SHOW_WALLET_SELECTOR } from '../../integration/url'
import { ABTestingVariant, FeatureFlags, getFeatureVariantName } from '../../state/selectors'
import './LoginContainer.css'

export const defaultAvailableProviders = []

const mapStateToProps = (state: StoreType): LoginContainerProps => {
  // test all connectors
  const enableProviders = new Set([ProviderType.INJECTED, ProviderType.FORTMATIC, ProviderType.WALLET_CONNECT])
  const availableProviders = connection.getAvailableProviders().filter((provider) => enableProviders.has(provider))

  let seamlessLogin =
    isElectron() || !!state.desktop.detected || SHOW_WALLET_SELECTOR
      ? ABTestingVariant.Disabled
      : (getFeatureVariantName(state, FeatureFlags.SeamlessLogin) as ABTestingVariant | undefined)

  if (!seamlessLogin && !!state.featureFlags.ready) {
    seamlessLogin = ABTestingVariant.Disabled
  }

  return {
    availableProviders,
    seamlessLogin,
    stage: state.session.kernelState?.loginStatus,
    provider: state.session.connection?.providerType,
    kernelReady: state.kernel.ready,
    rendererReady: state.renderer.ready,
    isGuest: state.session.kernelState ? state.session.kernelState.isGuest : undefined,
    isWallet: state.session.kernelState ? !state.session.kernelState.isGuest && !!state.session.connection : undefined
  }
}

enum TrackingActionType {
  SignIn = 'sign_in',
  CreateAccount = 'create_account'
}

const mapDispatchToProps = () => ({
  onLogin: (providerType: ProviderType | null, action_type?: TrackingActionType) => {
    track('click_login_button', { provider_type: providerType || 'guest', action_type })
    authenticate(providerType)
  },
  onCancelLogin: () => {
    track('click_cancel_login_button')
    disconnect().then(() => window.location.reload())
  }
})

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => {
  return {
    ...stateProps,
    ...dispatchProps,
    onLogin: (providerType: ProviderType | null, action_type?: TrackingActionType) => {
      // The UI will dispatch ProviderType.WALLET_CONNECT disregarding the version required.
      // We need to map it to the correct version to provide it to the connection library.
      const _providerType = providerType === ProviderType.WALLET_CONNECT ? ProviderType.WALLET_CONNECT_V2 : providerType

      track('click_login_button', {
        provider_type: _providerType || 'guest',
        action_type
      })

      authenticate(_providerType)
    }
  }
}

export interface LoginContainerProps {
  stage?: LoginState
  provider?: ProviderType
  availableProviders?: ProviderType[]
  kernelReady: boolean
  rendererReady: boolean
  isGuest?: boolean
  isWallet?: boolean
  seamlessLogin?: ABTestingVariant
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
  seamlessLogin
}) => {
  const [showWalletSelector, setShowWalletSelector] = useState<{
    open: boolean
    action_type?: TrackingActionType
  }>({ open: SHOW_WALLET_SELECTOR })
  const handleOpenSelector = useCallback(() => {
    track('open_login_popup')
    setShowWalletSelector({ open: true })
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
    <Main>
      {/* {stage === LoginState.CONNECT_ADVICE && <EthConnectAdvice onLogin={onLogin} />} */}
      {/* {stage === LoginState.SIGN_ADVICE && <EthSignAdvice />} */}

      <Container>
        <LogoContainer loading={!seamlessLogin || seamlessLogin === ABTestingVariant.Enabled} />
        <div>
          {seamlessLogin === ABTestingVariant.Disabled && (
            <LoginWalletItem
              loading={loading}
              active={isWallet}
              onClick={handleOpenSelector}
              provider={providerInUse}
              onCancelLogin={handleCancelLogin}
              canceling={canceling}
            />
          )}
          {seamlessLogin === ABTestingVariant.Disabled && (
            <LoginGuestItem loading={loading} active={isGuest} onClick={handleGuestLogin} />
          )}
        </div>
        <DownloadDesktopToast />
      </Container>

      <EthWalletSelector
        open={showWalletSelector.open}
        loading={loading}
        availableProviders={availableProviders || defaultAvailableProviders}
        provider={providerInUse}
        onLogin={onLogin}
        canceling={canceling}
        onCancelLogin={handleCancelLogin}
        onClose={handleCloseSelector}
      />

      {!isElectron() && <DownloadModal />}
    </Main>
  )
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LoginContainer)
