import React, { useMemo } from 'react'
import 'semantic-ui-css/semantic.min.css'
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import './App.css'
import { connect } from 'react-redux'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import ErrorContainer from './errors/ErrorContainer'
import LoginContainer from './auth/LoginContainer'
import { Audio } from './common/Audio'
import { StoreType } from '../state/redux'
import { isElectron } from '../integration/desktop'
import { BeginnersGuide } from './auth/BeginnersGuide'
import { BigFooter } from './common/Layout/BigFooter'
import BannerContainer from './banners/BannerContainer'
import { LoadingRender } from './common/Loading/LoadingRender'
import { Navbar } from './common/Layout/Navbar'
import { FeatureFlags, getFeatureVariant } from '../state/selectors'
import StreamContainer from './common/StreamContainer'
import { isMobile } from '../integration/browser'

function mapStateToProps(state: StoreType): AppProps {
  return {
    hasStream: !!getFeatureVariant(state, FeatureFlags.Stream),
    hasBanner: !!state.banner.banner,
    sessionReady: !!state.session?.ready,
    rendererReady: !!state.renderer?.ready,
    error: !!state.error.error,
    sound: true // TODO: sound must be true after the first click
  }
}

export interface AppProps {
  hasStream: boolean
  hasBanner: boolean
  sessionReady: boolean
  rendererReady: boolean
  error: boolean
  sound: boolean
}

const App: React.FC<AppProps> = (props) => {
  const mobile = useMemo(() => isMobile(), [])
  const small = useMobileMediaQuery()

  if (props.hasStream && (small || mobile)) {
    return <StreamContainer />
  }

  if (props.error) {
    return <ErrorContainer />
  }

  if (props.rendererReady) {
    return <React.Fragment />
  }

  if (props.sessionReady) {
    return <LoadingRender />
  }

  return (
    <div className={`WebsiteApp ${props.hasBanner ? 'withBanner' : ''}`}>
      {!isElectron() && props.sound && <Audio track={`${process.env.PUBLIC_URL}/tone4.mp3`} play />}
      <BannerContainer />
      {!isElectron() && <Navbar /> }
      <LoginContainer />
      {!isElectron() && <BeginnersGuide /> }
      {!isElectron() && <BigFooter /> }
    </div>
  )
}

export default connect(mapStateToProps)(App)
