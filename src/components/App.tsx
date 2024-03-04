import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { StoreType } from '../state/redux'
import { isElectron } from '../integration/desktop'
import { LOGIN_AS_GUEST, SHOW_WALLET_SELECTOR } from '../integration/url'
import {
  FeatureFlags,
  isWaitingForRenderer,
  isLoginComplete,
  ABTestingVariant,
  getFeatureVariantName,
  getFeatureVariantValue
} from '../state/selectors'
import { isMobile } from '../integration/browser'
import { LoadingRender } from './common/Loading/LoadingRender'
import { initializeKernel } from '../integration/kernel'
import StreamContainer from './common/StreamContainer'
import ErrorContainer from './errors/ErrorContainer'
import Start from './start'
import MobileContainer from './common/MobileContainer'
import CatalystWarningContainer from './warning/CatalystWarningContainer'
import { LoginWithAuthServerPage } from './auth/LoginWithAuthServerPage'
import './App.css'

function mapStateToProps(state: StoreType): AppProps {
  const seamlessLogin =
    isElectron() || !!state.desktop.detected || SHOW_WALLET_SELECTOR
      ? ABTestingVariant.Disabled
      : (getFeatureVariantName(state, FeatureFlags.SeamlessLogin) as ABTestingVariant | undefined)

  const hasStream = !!getFeatureVariantValue(state, FeatureFlags.Stream)
  const hasBanner = !!state.banner.banner
  const sessionReady = !!state.session?.ready
  const waitingForRenderer = isWaitingForRenderer(state)
  const loginComplete = isLoginComplete(state)
  const rendererReady = !!state.renderer?.ready
  const trustedCatalyst = !!state.catalyst?.trusted
  const error = !!state.error.error
  const sound = true // TODO: sound must be true after the first click

  return {
    seamlessLogin,
    hasStream,
    hasBanner,
    sessionReady,
    waitingForRenderer,
    loginComplete,
    rendererReady,
    trustedCatalyst,
    error,
    sound,
    featureFlagsLoaded: !!state.featureFlags.ready
  }
}

export interface AppProps {
  hasStream: boolean
  hasBanner: boolean
  sessionReady: boolean
  seamlessLogin?: ABTestingVariant
  waitingForRenderer: boolean
  loginComplete: boolean
  rendererReady: boolean
  trustedCatalyst: boolean
  error: boolean
  sound: boolean
  featureFlagsLoaded: boolean
}

const App: React.FC<AppProps> = (props) => {
  const mobile = useMemo(() => isMobile(), [])
  const small = useMobileMediaQuery()

  useEffect(() => {
    if (isElectron()) {
      initializeKernel()
    }
  }, [])

  if (!props.trustedCatalyst) {
    return <CatalystWarningContainer />
  }

  if (props.hasStream && (small || mobile)) {
    return <StreamContainer />
  }

  if (small || mobile) {
    return (
      <WalletProvider>
        <MobileContainer />
      </WalletProvider>
    )
  }

  if (props.error) {
    return <ErrorContainer />
  }

  if (props.rendererReady) {
    return <React.Fragment />
  }

  if (
    props.waitingForRenderer ||
    props.sessionReady ||
    props.seamlessLogin === ABTestingVariant.Enabled ||
    !props.featureFlagsLoaded
  ) {
    return <LoadingRender />
  }

  if (LOGIN_AS_GUEST && !SHOW_WALLET_SELECTOR) {
    initializeKernel()
    return <LoadingRender />
  }

  if (!isElectron()) {
    return (
      <WalletProvider>
        <Start initializeKernel={initializeKernel} />
      </WalletProvider>
    )
  } else {
    return <LoginWithAuthServerPage />
  }
}

export default connect(mapStateToProps)(App)
