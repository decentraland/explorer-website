import { useRef, useState } from 'react'
import { ProviderType } from '@dcl/schemas'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import './LoginWithAuthServerPage.css'
import { AuthServerProvider } from 'decentraland-connect'
import { authenticate } from '../../kernel-loader'

enum View {
  WELCOME,
  SIGN_IN_CODE
}

export const LoginWithAuthServerPage = () => {
  const [view, setView] = useState<View>(View.WELCOME)
  const initSignInResultRef = useRef<any>()

  if (view === View.WELCOME) {
    return (
      <div className="LoginWithAuthServerPage">
        <div className="background"></div>
        <div className="main">
          <div className="logo"></div>
          <div className="title">Unlock Your Virtual World.</div>
          <div className="subtitle">Access and start exploring.</div>
          <Button
            className="button"
            primary
            onClick={async () => {
              const initSignInResult = await AuthServerProvider.initSignIn()
              initSignInResultRef.current = initSignInResult
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
            className="button"
            primary
            onClick={async () => {
              await AuthServerProvider.finishSignIn(initSignInResultRef.current!)
              authenticate(ProviderType.AUTH_SERVER)
            }}
          >
            Continue to sign in
          </Button>
        </div>
      </div>
    )
  }

  return <div>asd</div>
}
