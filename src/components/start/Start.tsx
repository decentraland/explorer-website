import { useCallback, useEffect, useState } from 'react'
import { CommunityBubble } from 'decentraland-ui/dist/components/CommunityBubble'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import { SKIP_SETUP } from '../../integration/url'
import { launchDesktopApp } from '../../integration/desktop'
import { CustomWearablePreview } from '../common/CustomWearablePreview'
import BannerContainer from '../banners/BannerContainer'
import logo from '../../images/simple-logo.svg'
import { Props } from './Start.types'
import './Start.css'

function getAuthURL() {
  var url = new URL(window.location.href)
  if (!url.searchParams.has('skipSetup')) {
    url.searchParams.append('skipSetup', 'true')
  }
  return `/auth/login?redirectTo=${encodeURIComponent(url.toString())}`
}

const useLocalStorageListener = (key: string) => {
  const [value, setValue] = useState(localStorage.getItem(key))
  useEffect(() => {
    const callback = (event: any) => {
      if (event.key === key) {
        setValue(event.newValue)
      }
    }
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
  }, [])
  return value
}

export default function Start(props: Props) {
  const {
    isConnected,
    isConnecting,
    wallet,
    profile,
    initializeKernel,
    isLoadingProfile,
    hasInitializedConnection,
    isDiscoverExplorerAlphaEnabled
  } = props
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false)
  const [showExplorerAlphaNotice, setShowExplorerAlphaNotice] = useState(false)
  const decentralandConnectStorage = useLocalStorageListener('decentraland-connect-storage-key')
  const name = profile?.avatars[0].name

  useEffect(() => {
    if ((!isConnected && !isConnecting && hasInitializedConnection) || decentralandConnectStorage === null) {
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
  }, [isConnected, isConnecting, wallet, hasInitializedConnection, decentralandConnectStorage])

  const handleContinueOnDesktop = useCallback(() => {
    setShowExplorerAlphaNotice(false)
    launchDesktopApp(true).then((isInstalled) => {
      if (!isInstalled) {
        window.location.href = 'https://decentraland.org/download'
      }
    })
  }, [launchDesktopApp, setShowExplorerAlphaNotice])

  const handleContinueOnWeb = useCallback(() => {
    setShowExplorerAlphaNotice(false)
    initializeKernel()
    setIsLoadingExplorer(true)
  }, [setShowExplorerAlphaNotice, initializeKernel, setIsLoadingExplorer])

  const handleJumpIn = useCallback(() => {
    if (isDiscoverExplorerAlphaEnabled) {
      setShowExplorerAlphaNotice(true)
    } else {
      handleContinueOnWeb()
    }
  }, [isDiscoverExplorerAlphaEnabled, setShowExplorerAlphaNotice, handleContinueOnWeb])

  useEffect(() => {
    if (SKIP_SETUP) {
      handleJumpIn()
    }
  }, [handleJumpIn])

  if (SKIP_SETUP) {
    return null
  }

  if (!hasInitializedConnection || isLoadingProfile || isConnecting) {
    return (
      <div className="explorer-website-start">
        <Loader active size="massive" />
      </div>
    )
  }

  return (
    <div className="explorer-website-start">
      <div className="start-banner-container">
        <BannerContainer />
      </div>
      <div className="start-info">
        <div className="start-links">
          <img alt="decentraland" src={logo} height="40" width="40" />
          <div className="start-title">
            <span>
              <strong>{`Welcome back ${name || ''}`}</strong>
            </span>
            <span>Ready to explore?</span>
          </div>
          <Button primary onClick={handleJumpIn} disabled={isLoadingExplorer} loading={isLoadingExplorer}>
            jump into decentraland
            <Icon name="arrow alternate circle right outline" />
          </Button>
          <Button inverted as="a" href={getAuthURL()} disabled={isLoadingExplorer}>
            use a different account
          </Button>
        </div>
        <div className="start-desktop-download">
          <span>Want better performance?</span>
          <a href="https://decentraland.org/download/" target="_blank" rel="noreferrer noopener">
            👉 <span>Download Desktop Client</span>
          </a>
        </div>
      </div>
      <div className="start-wearable-preview">
        <CustomWearablePreview profile={wallet?.address ?? ''} />
      </div>
      <CommunityBubble className="start-community-bubble" />
      <Modal
        open={showExplorerAlphaNotice}
        size="tiny"
        onClose={() => setShowExplorerAlphaNotice(false)}
        className="explorer-alpha-notice"
        dimmer={{ className: 'explorer-alpha-notice-dimmer' }}
      >
        <ModalNavigation title="" onClose={() => setShowExplorerAlphaNotice(false)} />
        <div className="content">
          <div className="header">
            <i className="icon" />
            <p className="title">This is An Outdated Version of Decentraland</p>
            <p className="text">
              Decentraland has been re-released as a desktop app offering a completely new experience. Download and
              discover improved performance, better graphics, and lots of new features!
            </p>
          </div>
          <div className="actions">
            <Button primary onClick={handleContinueOnDesktop}>
              Continue on Desktop
            </Button>
            <Button onClick={handleContinueOnWeb}>Continue on Web</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
