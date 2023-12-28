import { useEffect, useRef, useState } from 'react'
import { ProviderType } from '@dcl/schemas'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { AuthServerProvider, connection } from 'decentraland-connect'
import { authenticate } from '../../kernel-loader'
import './LoginWithAuthServerPage.css'

enum View {
  WELCOME,
  SIGN_IN_CODE,
  EXPIRED
}

export const LoginWithAuthServerPage = () => {
  const [view, setView] = useState<View>(View.WELCOME)
  const [disabled, setDisabled] = useState(false)

  const initSignInResultRef = useRef<any>()
  const expirationTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const url = new URL(window.location.href)

    switch (url.origin) {
      case 'https://decentraland.org':
        AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.org')
        AuthServerProvider.setAuthDappUrl('https://decentraland.org/auth')
        break
      case 'https://decentraland.today':
        AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.today')
        AuthServerProvider.setAuthDappUrl('https://decentraland.today/auth')
        break
      default:
        AuthServerProvider.setAuthServerUrl('https://auth-api.decentraland.zone')
        AuthServerProvider.setAuthDappUrl('https://decentraland.zone/auth')
    }

    return () => {
      clearTimeout(expirationTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setDisabled(false)
  }, [view])

  if (view === View.WELCOME) {
    return (
      <div className="LoginWithAuthServerPage">
        <div className="background"></div>
        <div className="main">
          <div className="logo"></div>
          <div className="title">Discover a virtual social world</div>
          <div className="subtitle">shaped by its community of creators & explorers.</div>
          <Button
            disabled={disabled}
            className="button"
            primary
            onClick={async () => {
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

              expirationTimeoutRef.current = setTimeout(() => {
                setView(View.EXPIRED)
              }, new Date(initSignInResult.requestResponse.expiration).getTime() - Date.now())

              setView(View.SIGN_IN_CODE)
            }}
          >
            Start
          </Button>
        </div>
      </div>
    )
  }

  if (view === View.SIGN_IN_CODE) {
    return (
      <div className="LoginWithAuthServerPage">
        <div className="background"></div>
        <div className="main">
          <div
            className="back"
            onClick={() => {
              initSignInResultRef.current = null
              setView(View.WELCOME)
            }}
          ></div>
          <div className="title">Secure sign-in step</div>
          <div className="subtitle-sign-in-code">
            Remember the verification number below. You'll be prompted to confirm it in your web browser to securely
            link your sign in.
          </div>
          <div className="code">{initSignInResultRef.current!.requestResponse.code}</div>
          <Button
            disabled={disabled}
            className="button"
            primary
            onClick={async () => {
              setDisabled(true)
              await AuthServerProvider.finishSignIn(initSignInResultRef.current!)
              await authenticate(ProviderType.AUTH_SERVER)
            }}
          >
            Continue to sign in
          </Button>
        </div>
      </div>
    )
  }

  if (view === View.EXPIRED) {
    return (
      <div className="LoginWithAuthServerPage">
        <div className="background"></div>
        <div className="main">
          <div
            className="back"
            onClick={() => {
              initSignInResultRef.current = null
              setView(View.WELCOME)
            }}
          ></div>
          <div className="title">Looks like you took too long and the session expired.</div>
          <div className="subtitle-sign-in-code">Please go back and try again.</div>
        </div>
      </div>
    )
  }

  return <div>asd</div>
}
