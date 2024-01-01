import { useCallback, useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import { LOGIN_AS_GUEST, SKIP_SETUP } from '../../integration/url'
import { initializeKernel } from '../../integration/kernel'
import { getWantedChainId } from '../../kernel-loader'
import logo from '../../images/simple-logo.svg'
import { Props } from './Start.types'
import './Start.css'

function getAuthURL() {
  var url = new URL(window.location.href);
  url.searchParams.append('skipSetup', 'true')
  return `/auth/login?redirectTo=${encodeURIComponent(url.toString())}`
}

export default function Start(props: Props) {
  const { isConnected, isConnecting, wallet } = props
  const [initialized, setInitialized] = useState(false)
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false)

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
      <div className="start-info">
        <div className="start-links">
          <img alt="decentraland" src={logo} height="40" width="40" />
          <div className="start-title">
            <span>
              <strong>Welcome back</strong>
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
      <div className="start-wearable-preview">
        <WearablePreview
          profile={wallet?.address}
          disableBackground
          dev={getWantedChainId() === ChainId.ETHEREUM_SEPOLIA}
        />
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
