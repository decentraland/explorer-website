import { Button } from 'decentraland-ui/dist/components/Button/Button'
import './LoginWithAuthServerPage.css'

export const LoginWithAuthServerPage = () => {
  return (
    <div className="LoginWithAuthServerPage">
      <div className="background"></div>
      <div className="main">
        <div className="logo"></div>
        <div className="title">Unlock Your Virtual World.</div>
        <div className="subtitle">Access and start exploring.</div>
        <Button className="start" primary>
          Start
        </Button>
      </div>
    </div>
  )
}
