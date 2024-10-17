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

function getAuthURL(skipSetup: boolean) {
  var url = new URL(window.location.href)
  if (skipSetup) {
    if (!url.searchParams.has('skipSetup')) {
      url.searchParams.append('skipSetup', 'true')
    }
  } else {
    if (url.searchParams.has('skipSetup')) {
      url.searchParams.delete('skipSetup')
    }
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
    isDiscoverExplorerAlphaEnabled,
    areFeatureFlagsReady
  } = props
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false)
  const [showExplorerAlphaNotice, setShowExplorerAlphaNotice] = useState(false)
  const [isExplorerAlphaInstalled, setIsExplorerAlphaInstalled] = useState(false)
  const [isLaunchingExplorerAlpha, setIsLaunchingExplorerAlpha] = useState(false)
  const decentralandConnectStorage = useLocalStorageListener('decentraland-connect-storage-key')
  const name = profile?.avatars[0].name

  useEffect(() => {
    if (!areFeatureFlagsReady) {
      return
    }

    if ((!isConnected && !isConnecting && hasInitializedConnection) || decentralandConnectStorage === null) {
      window.location.replace(getAuthURL(!isDiscoverExplorerAlphaEnabled))
      return
    }

    if (isConnected && wallet) {
      const identity = localStorageGetIdentity(wallet.address)
      if (!identity) {
        window.location.replace(getAuthURL(!isDiscoverExplorerAlphaEnabled))
        return
      }
    }
  }, [
    isConnected,
    isConnecting,
    wallet,
    hasInitializedConnection,
    decentralandConnectStorage,
    isDiscoverExplorerAlphaEnabled,
    areFeatureFlagsReady
  ])

  const handleReLaunch = useCallback(() => {
    void launchDesktopApp(true)
  }, [launchDesktopApp])

  const handleContinueWithWebVersion = useCallback(() => {
    setShowExplorerAlphaNotice(false)
  }, [setShowExplorerAlphaNotice])

  const handleJumpIn = useCallback(() => {
    setShowExplorerAlphaNotice(false)
    initializeKernel()
    setIsLoadingExplorer(true)
  }, [setShowExplorerAlphaNotice, initializeKernel, setIsLoadingExplorer])

  useEffect(() => {
    if (SKIP_SETUP) {
      handleJumpIn()
    } else if (wallet && isDiscoverExplorerAlphaEnabled) {
      const identity = localStorageGetIdentity(wallet.address)
      if (identity) {
        setIsLaunchingExplorerAlpha(true)
        launchDesktopApp(true).then((isInstalled) => {
          setIsExplorerAlphaInstalled(isInstalled)
          setShowExplorerAlphaNotice(true)
          setIsLaunchingExplorerAlpha(false)
        })
      }
    }
  }, [
    handleJumpIn,
    isDiscoverExplorerAlphaEnabled,
    setIsExplorerAlphaInstalled,
    setShowExplorerAlphaNotice,
    setIsLaunchingExplorerAlpha,
    wallet
  ])

  if (SKIP_SETUP) {
    return null
  }

  if (
    !hasInitializedConnection ||
    isLoadingProfile ||
    isConnecting ||
    isLaunchingExplorerAlpha ||
    !areFeatureFlagsReady
  ) {
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
          <Button inverted as="a" href={getAuthURL(isDiscoverExplorerAlphaEnabled)} disabled={isLoadingExplorer}>
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
          {!isExplorerAlphaInstalled ? (
            <>
              <div className="header">
                <i className="icon" />
                <p className="title">This is An Outdated Version of Decentraland</p>
                <p className="text">
                  Decentraland has been re-released as a desktop app offering a completely new experience. Download and
                  discover improved performance, better graphics, and lots of new features!
                </p>
              </div>
              <div className="actions">
                <Button primary href="https://decentraland.org/download">
                  Download Decentraland
                </Button>
                <Button onClick={handleContinueWithWebVersion}>Continue with outdated web version</Button>
              </div>
            </>
          ) : (
            <>
              <div className="header">
                <i className="icon" />
                <p className="title">Continue on Desktop</p>
                <p className="text">For a better experience, we suggest you use the desktop explorer.</p>
              </div>
              <div className="actions">
                <Button primary onClick={handleReLaunch}>
                  Re-Launch
                </Button>
                <Button onClick={handleContinueWithWebVersion}>Continue with outdated web version</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
