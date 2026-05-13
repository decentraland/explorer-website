import { useCallback, useEffect, useRef, useState } from 'react'
import { CircularProgress } from 'decentraland-ui2'
import ArrowCircleRightOutlined from '@mui/icons-material/ArrowCircleRightOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import { SKIP_SETUP } from '../../integration/url'
import { launchDesktopApp } from '../../integration/desktop'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import { CustomWearablePreview } from '../common/CustomWearablePreview'
import BannerContainer from '../banners/BannerContainer'
import logo from '../../images/simple-logo.svg'
import { Props } from './Start.types'
import {
  StartRoot,
  StartLoader,
  StartBannerContainer,
  StartInfo,
  StartLinks,
  StartTitle,
  DesktopDownload,
  StartWearablePreview,
  PrimaryButton,
  InvertedButton,
  BottomCommunityBubble,
  AlphaDialog,
  AlphaHeader,
  AlphaIcon,
  AlphaTitle,
  AlphaText,
  AlphaActions,
  ModalButton,
  AlphaCloseButton
} from './Start.styled'

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
  const l = useFormatMessage()
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false)
  const [showExplorerAlphaNotice, setShowExplorerAlphaNotice] = useState(false)
  const [isExplorerAlphaInstalled, setIsExplorerAlphaInstalled] = useState(false)
  const [isLaunchingExplorerAlpha, setIsLaunchingExplorerAlpha] = useState(false)
  // Probe at most once per mount: StrictMode double-fires + wallet/flag churn could otherwise re-trigger
  // the decentraland:// deeplink. Manual re-launch via the modal's Re-Launch button bypasses this.
  const probedDesktopRef = useRef(false)
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
  }, [])

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
      if (identity && !probedDesktopRef.current) {
        probedDesktopRef.current = true
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
      <StartLoader>
        <CircularProgress size={80} sx={{ color: 'white' }} />
      </StartLoader>
    )
  }

  return (
    <StartRoot>
      <StartBannerContainer>
        <BannerContainer />
      </StartBannerContainer>
      <StartInfo>
        <StartLinks>
          <img alt="decentraland" src={logo} height="40" width="40" />
          <StartTitle>
            <span>
              <strong>{l('start.welcome_back', { name: name || '' })}</strong>
            </span>
            <span>{l('start.ready')}</span>
          </StartTitle>
          <PrimaryButton
            variant="contained"
            color="primary"
            onClick={handleJumpIn}
            disabled={isLoadingExplorer}
            endIcon={<ArrowCircleRightOutlined />}
          >
            {isLoadingExplorer ? <CircularProgress size={20} color="inherit" /> : l('start.jump_in')}
          </PrimaryButton>
          <InvertedButton
            variant="outlined"
            href={getAuthURL(isDiscoverExplorerAlphaEnabled)}
            disabled={isLoadingExplorer}
          >
            {l('start.different_account')}
          </InvertedButton>
        </StartLinks>
        <DesktopDownload>
          <span>{l('start.performance_pitch')}</span>
          <a href="https://decentraland.org/download/" target="_blank" rel="noreferrer noopener">
            👉 <span>{l('start.download_desktop_cta')}</span>
          </a>
        </DesktopDownload>
      </StartInfo>
      <StartWearablePreview>
        <CustomWearablePreview profile={wallet?.address ?? ''} />
      </StartWearablePreview>
      <BottomCommunityBubble />
      <AlphaDialog open={showExplorerAlphaNotice} onClose={() => setShowExplorerAlphaNotice(false)}>
        <AlphaCloseButton aria-label="close" onClick={() => setShowExplorerAlphaNotice(false)}>
          <CloseIcon />
        </AlphaCloseButton>
        {!isExplorerAlphaInstalled ? (
          <>
            <AlphaHeader>
              <AlphaIcon />
              <AlphaTitle>{l('start.alpha.outdated_title')}</AlphaTitle>
              <AlphaText>{l('start.alpha.outdated_text')}</AlphaText>
            </AlphaHeader>
            <AlphaActions>
              <ModalButton variant="contained" color="primary" href="https://decentraland.org/download">
                {l('start.alpha.download_cta')}
              </ModalButton>
              <ModalButton variant="text" onClick={handleContinueWithWebVersion}>
                {l('start.alpha.continue_web_cta')}
              </ModalButton>
            </AlphaActions>
          </>
        ) : (
          <>
            <AlphaHeader>
              <AlphaIcon />
              <AlphaTitle>{l('start.alpha.continue_desktop_title')}</AlphaTitle>
              <AlphaText>{l('start.alpha.continue_desktop_text')}</AlphaText>
            </AlphaHeader>
            <AlphaActions>
              <ModalButton variant="contained" color="primary" onClick={handleReLaunch}>
                {l('start.alpha.relaunch_cta')}
              </ModalButton>
              <ModalButton variant="text" onClick={handleContinueWithWebVersion}>
                {l('start.alpha.continue_web_cta')}
              </ModalButton>
            </AlphaActions>
          </>
        )}
      </AlphaDialog>
    </StartRoot>
  )
}
