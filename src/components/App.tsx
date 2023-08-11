import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import ErrorContainer from './errors/ErrorContainer'
import LoginContainer from './auth/LoginContainer'
import { StoreType } from '../state/redux'
import { isElectron } from '../integration/desktop'
import { SHOW_WALLET_SELECTOR } from '../integration/url'
import { BeginnersGuide } from './auth/BeginnersGuide'
import { BigFooter } from './common/Layout/BigFooter'
import BannerContainer from './banners/BannerContainer'
import { LoadingRender } from './common/Loading/LoadingRender'
import { Navbar } from './common/Layout/Navbar'
import {
  FeatureFlags,
  isWaitingForRenderer,
  isLoginComplete,
  ABTestingVariant,
  getFeatureVariantName,
  getFeatureVariantValue
} from '../state/selectors'
import StreamContainer from './common/StreamContainer'
import { Audio } from './common/Audio'
import { isMobile } from '../integration/browser'
import MobileContainer from './common/MobileContainer'
import CatalystWarningContainer from './warning/CatalystWarningContainer'
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
    sound
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
}

const App: React.FC<AppProps> = (props) => {
  const mobile = useMemo(() => isMobile(), [])
  const small = useMobileMediaQuery()

  if (!props.trustedCatalyst) {
    return <CatalystWarningContainer />
  }

  if (props.hasStream && (small || mobile)) {
    return <StreamContainer />
  }

  if (small || mobile) {
    return <MobileContainer />
  }

  if (props.error) {
    return <ErrorContainer />
  }

  if (props.rendererReady) {
    return <React.Fragment />
  }

  if (props.waitingForRenderer || props.sessionReady || props.seamlessLogin === ABTestingVariant.Enabled) {
    return <LoadingRender />
  }

  return (
    <div className={`WebsiteApp ${props.hasBanner ? 'withBanner' : ''}`}>
      <BannerContainer />
      {/**
       * The audio tag is required to prevent the tab from halting the scripting if left unfocused
       * @see https://github.com/decentraland/explorer-website/pull/333#discussion_r1084094994
       * @see https://github.com/eordano/background-throttle
       */}
      {!isElectron() && props.sound && <Audio track={`${process.env.PUBLIC_URL}/tone4.mp3`} play />}
      {!isElectron() && <Navbar />}
      <LoginContainer />
      {!isElectron() && <BeginnersGuide />}
      {!isElectron() && <BigFooter />}
    </div>
  )
}

export default connect(mapStateToProps)(App)
