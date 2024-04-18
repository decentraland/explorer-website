import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChainId, ProviderType } from '@dcl/schemas'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { InfoTooltip } from 'decentraland-ui/dist/components/InfoTooltip/InfoTooltip'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { AuthServerProvider } from 'decentraland-connect'
import { authenticate, getWantedChainId } from '../../kernel-loader'
import './LoginWithAuthServerPage.css'

enum View {
  LOADING,
  WELCOME,
  WELCOME_CONNECTED,
  SIGN_IN_CODE,
  EXPIRED
}

export const LoginWithAuthServerPage = () => {
  const [view, setView] = useState<View>(View.LOADING)
  const [isLoading, setIsLoading] = useState(false)
  const [expirationCountdown, setExpirationCountdown] = useState({ minutes: '0', seconds: '00' })

  const initSignInResultRef = useRef<any>()
  const expirationTimeoutRef = useRef<NodeJS.Timeout>()
  const updateExpirationIntervalRef = useRef<NodeJS.Timeout>()
  const connectedAccountRef = useRef<string>()
  const connectedNameRef = useRef<string>()

  useEffect(() => {
    ;(async () => {
      const url = new URL(window.location.href)

      switch (url.origin) {
        case 'https://decentraland.org':
        case 'https://play.decentraland.org':
          AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.org')
          AuthServerProvider.setAuthDappUrl('https://decentraland.org/auth')
          break
        case 'https://decentraland.today':
        case 'https://play.decentraland.today':
          AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.today')
          AuthServerProvider.setAuthDappUrl('https://decentraland.today/auth')
          break
        default:
          AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.zone')
          AuthServerProvider.setAuthDappUrl('https://decentraland.zone/auth')
      }

      const connectedAccount = AuthServerProvider.getAccount()
      const hasValidIdentity = AuthServerProvider.hasValidIdentity()

      // Checks if there is a persisted account and unexpired identity to show the user as connected.
      if (connectedAccount && hasValidIdentity) {
        connectedAccountRef.current = connectedAccount

        const env = getWantedChainId() === ChainId.ETHEREUM_MAINNET ? 'org' : 'zone'
        const fetchProfileUrl = `https://peer.decentraland.${env}/lambdas/profiles/`

        try {
          const fetchResult = await fetch(fetchProfileUrl + connectedAccount)
          const profile = await fetchResult.json()
          connectedNameRef.current = profile.avatars[0].name
        } catch (e) {
          // Could not obtain the profile.
          // Maybe because it is a newly created account and it doesn't have a profile yet.
        }

        setView(View.WELCOME_CONNECTED)
      } else {
        setView(View.WELCOME)
      }
    })()
  }, [])

  // Handle things when the view changes.
  useEffect(() => {
    // Clear timeouts and intervals when the view is not 'sign in code'.
    if (view !== View.SIGN_IN_CODE) {
      clearTimeout(expirationTimeoutRef.current)
      clearInterval(updateExpirationIntervalRef.current)
    }
  }, [view])

  const onWelcomeStart = useCallback(async () => {
    setIsLoading(true)

    // If there is an account already connected, authenticate to start the app.
    if (connectedAccountRef.current) {
      await authenticate(ProviderType.AUTH_SERVER)
      return
    }

    const initSignInResult = await AuthServerProvider.initSignIn()
    initSignInResultRef.current = initSignInResult

    // Start the timer that will render the expired view once the request expires.
    expirationTimeoutRef.current = setTimeout(() => {
      setView(View.EXPIRED)
    }, new Date(initSignInResult.requestResponse.expiration).getTime() - Date.now())

    const calculateAndSetExpirationCountdown = () => {
      const diff = new Date(initSignInResult.requestResponse.expiration).getTime() - Date.now()

      setExpirationCountdown({
        minutes: Math.floor(diff / 1000 / 60).toString(),
        seconds: Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, '0')
      })
    }

    calculateAndSetExpirationCountdown()

    // Start the interval that will update each second, how much time until the request expires.
    updateExpirationIntervalRef.current = setInterval(() => {
      calculateAndSetExpirationCountdown()
    }, 1000)

    setIsLoading(false)
    setView(View.SIGN_IN_CODE)

    await AuthServerProvider.finishSignIn(initSignInResultRef.current)
    window.location.reload()
  }, [])

  const handleGuestLogIn = useCallback((event) => {
    setView(View.LOADING)
    event.preventDefault()
    return authenticate(null)
  }, [])

  const onBack = useCallback(() => {
    initSignInResultRef.current = null
    setView(View.WELCOME)
  }, [])

  const onChangeAccount = useCallback(() => {
    AuthServerProvider.deactivate()
    window.location.reload()
  }, [])

  if (view === View.LOADING) {
    return <Container left={<Loader active size="huge" />} />
  }

  if (view === View.WELCOME) {
    return (
      <Container
        left={
          <>
            <div className="logo"></div>
            <div className="title">Discover a virtual social world</div>
            <div className="subtitle">shaped by its community of creators & explorers.</div>
            <Button disabled={isLoading} className="button" primary loading={isLoading} onClick={onWelcomeStart}>
              Start
            </Button>
            <div className="guestInfo">
              Quick dive?{' '}
              <a href="#" onClick={handleGuestLogIn}>
                Explore as a guest
              </a>
            </div>
          </>
        }
      />
    )
  }

  if (view === View.WELCOME_CONNECTED && connectedAccountRef.current) {
    return (
      <Container
        left={
          <>
            <div className="logo"></div>
            <div className="title">Welcome{connectedNameRef.current ? ` ${connectedNameRef.current}` : ''}!</div>
            <div className="subtitle">Ready to explore?</div>
            <div className="button-container">
              <Button className="button" primary onClick={onWelcomeStart}>
                Start
              </Button>
              <Button className="button button-secondary" inverted onClick={onChangeAccount}>
                Use a different account
              </Button>
            </div>
          </>
        }
        right={
          <WearablePreview
            lockBeta
            panning={false}
            disableBackground
            profile={connectedAccountRef.current}
            dev={getWantedChainId() !== ChainId.ETHEREUM_MAINNET}
          />
        }
      />
    )
  }

  if (view === View.SIGN_IN_CODE) {
    return (
      <Container
        left={
          <>
            <div className="back" onClick={onBack}></div>
            <div className="title">Secure sign-in step</div>
            <div className="subtitle-sign-in-code">
              Remember the verification number below.
              <br />
              You'll be prompted to confirm it in your web browser to securely link your sign in.
            </div>
            <div className="code">
              <span>{initSignInResultRef.current!.requestResponse.code}</span>
              <div className="tooltip">
                <InfoTooltip
                  position="right center"
                  content="Keep this number private. It ensures that your sign-in is secure and unique to you."
                />
              </div>
            </div>
            <div className="code-expiration">
              Verification number will expire in {expirationCountdown.minutes}:{expirationCountdown.seconds} minutes
            </div>
          </>
        }
      />
    )
  }

  if (view === View.EXPIRED) {
    return (
      <Container
        left={
          <>
            <div className="back" onClick={onBack}></div>
            <div className="title">Looks like you took too long and the session expired.</div>
            <div className="subtitle-sign-in-code">Please go back and try again.</div>
          </>
        }
      />
    )
  }

  return null
}

const Container = (props: { left: ReactNode; right?: ReactNode }) => {
  return (
    <div className="LoginWithAuthServerPage">
      <div className="background"></div>
      <div className="main">
        <div className="left">{props.left}</div>
        <div className="right">{props.right}</div>
      </div>
    </div>
  )
}
