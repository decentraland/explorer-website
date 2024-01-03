import { useCallback, useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import { LOGIN_AS_GUEST, SKIP_SETUP } from '../../integration/url'
import { initializeKernel } from '../../integration/kernel'
import platformImg from '../../images/Platform.webp'
import manDefault from '../../images/ManDefault.webp'
import BannerContainer from '../banners/BannerContainer'
import { getWantedChainId } from '../../kernel-loader'
import logo from '../../images/simple-logo.svg'
import { Props } from './Start.types'
import './Start.css'

function getAuthURL() {
  var url = new URL(window.location.href)
  url.searchParams.append('skipSetup', 'true')
  return `/auth/login?redirectTo=${encodeURIComponent(url.toString())}`
}

export default function Start(props: Props) {
  const { isConnected, isConnecting, wallet, profile } = props
  const [initialized, setInitialized] = useState(false)
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true)

  const name = profile?.avatars[0].name

  useEffect(() => {
    // remove loading component
    const loadingElement = document.getElementById('root-loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }
    if (isConnecting) {
      setInitialized(true)
    }
  }, [isConnecting])

  useEffect(() => {
    if (!isConnected && !isConnecting && initialized) {
      window.location.replace(getAuthURL())
      return
    }

    if (isConnected && wallet) {
      const identity = localStorageGetIdentity(wallet.address)
      if (!identity) {
        window.location.replace(getAuthURL())
        return
      }
    }
  }, [isConnected, isConnecting, wallet, initialized])

  const handleJumpIn = useCallback(() => {
    initializeKernel()
    setIsLoadingExplorer(true)
  }, [])

  const handleWearablePreviewLoad = useCallback(
    (params) => {
      if (wallet?.address && params.profile === wallet.address) setIsLoadingAvatar(false)
    },
    [wallet?.address]
  )

  useEffect(() => {
    if (SKIP_SETUP || LOGIN_AS_GUEST) {
      handleJumpIn()
    }
  }, [handleJumpIn])

  if (SKIP_SETUP || LOGIN_AS_GUEST) {
    return null
  }

  if (isConnecting && !initialized) {
    return (
      <div className="explorer-website-start">
        <Loader active size="massive" />
      </div>
    )
  }

  return (
    <div className="explorer-website-start">
      <BannerContainer />
      <div className="start-info">
        <div className="start-links">
          <img alt="decentraland" src={logo} height="40" width="40" />
          <div className="start-title">
            <span>
              <strong>{`Welcome back ${name || ''}`}</strong>
            </span>
            <span>Are you ready to explore?</span>
          </div>
          <Button primary onClick={handleJumpIn} disabled={isLoadingExplorer} loading={isLoadingExplorer}>
            jump into decentrland
            <Icon name="arrow alternate circle right outline" />
          </Button>
          <Button inverted as="a" href={getAuthURL()} disabled={isLoadingExplorer}>
            use another account
          </Button>
        </div>
        <div className="start-desktop-download">
          <span>Want better graphics and faster speed?</span>
          <a href="https://decentraland.org/download/" target="_blank" rel="noreferrer noopener">
            👉 <span>Download desktop client</span>
          </a>
        </div>
      </div>
      <div className={`start-wearable-preview ${isLoadingAvatar ? 'loading' : ''}`}>
        <img src={manDefault} className="wearable-default-img" />
        <WearablePreview
          profile={wallet?.address}
          disableBackground
          lockBeta
          onUpdate={handleWearablePreviewLoad}
          dev={getWantedChainId() !== ChainId.ETHEREUM_MAINNET}
        />
        <img src={platformImg} alt="platform" className="wearable-platform" />
      </div>
      <a className="discord-link-button" href="https://decentraland.org/discord" target="about:blank">
        <Icon name="discord" className="discord-icon" />
        <p className="discord-info">
          <span>Need guidance?</span>
          <span>MEET THE COMMUNITY</span>
        </p>
      </a>
    </div>
  )
}
