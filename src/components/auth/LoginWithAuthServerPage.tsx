import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ChainId, ProviderType } from '@dcl/schemas'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { AuthServerProvider, connection } from 'decentraland-connect'
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
  const [disabled, setDisabled] = useState(false)

  const initSignInResultRef = useRef<any>()
  const expirationTimeoutRef = useRef<NodeJS.Timeout>()
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

      if (connectedAccount) {
        connectedAccountRef.current = connectedAccount

        const env = getWantedChainId() === ChainId.ETHEREUM_SEPOLIA ? 'zone' : 'org'
        const fetchProfileUrl = `https://peer.decentraland.${env}/lambdas/profiles/`

        const fetchResult = await fetch(fetchProfileUrl + connectedAccount)
        const profile = await fetchResult.json()
        connectedNameRef.current = profile.avatars[0].name

        setView(View.WELCOME_CONNECTED)
      } else {
        setView(View.WELCOME)
      }
    })()

    return () => {
      clearTimeout(expirationTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setDisabled(false)
  }, [view])

  const onWelcomeStart = useCallback(async () => {
    setDisabled(true)

    try {
      await connection.tryPreviousConnection()
      await authenticate(ProviderType.AUTH_SERVER)
    } catch (e) {
      // No previous connection.
      // Continue with auth server login.
    }

    const initSignInResult = await AuthServerProvider.initSignIn()
    initSignInResultRef.current = initSignInResult

    // Start the timer that will render the expired view once the request expires.
    expirationTimeoutRef.current = setTimeout(() => {
      setView(View.EXPIRED)
    }, new Date(initSignInResult.requestResponse.expiration).getTime() - Date.now())

    setView(View.SIGN_IN_CODE)
  }, [])

  const onSignInCodeContinue = useCallback(async () => {
    setDisabled(true)

    if (!initSignInResultRef.current) {
      throw new Error('No init sign in result found.')
    }

    await AuthServerProvider.finishSignIn(initSignInResultRef.current)
    await authenticate(ProviderType.AUTH_SERVER)
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
            <Button disabled={disabled} className="button" primary onClick={onWelcomeStart}>
              Start
            </Button>
          </>
        }
      />
    )
  }

  if (view === View.WELCOME_CONNECTED && connectedAccountRef.current && connectedNameRef.current) {
    return (
      <Container
        left={
          <>
            <div className="logo"></div>
            <div className="title">Welcome {connectedNameRef.current}!</div>
            <div className="subtitle">Ready to explore?</div>
            <div className="button-container">
              <Button disabled={disabled} className="button" primary onClick={onWelcomeStart}>
                Start
              </Button>
              <Button disabled={disabled} className="button button-secondary" inverted onClick={onChangeAccount}>
                Use a different account
              </Button>
            </div>
          </>
        }
        right={
          <>
            <WearablePreview
              lockBeta={true}
              panning={false}
              disableBackground={true}
              disableDefaultWearables
              profile={connectedAccountRef.current}
              dev={getWantedChainId() === ChainId.ETHEREUM_SEPOLIA}
            />
          </>
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
              Remember the verification number below. You'll be prompted to confirm it in your web browser to securely
              link your sign in.
            </div>
            <div className="code">{initSignInResultRef.current!.requestResponse.code}</div>
            <Button disabled={disabled} className="button" primary onClick={onSignInCodeContinue}>
              Continue to sign in
            </Button>
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
