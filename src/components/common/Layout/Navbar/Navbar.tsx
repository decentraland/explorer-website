import { useCallback } from 'react'
import { Navbar as Base } from 'decentraland-ui2'
import { Props } from './Navbar.types'

const Navbar = (props: Props) => {
  const handleSignIn = useCallback(() => {
    const site = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/play' : ''
    window.location.replace(`/auth/login?redirectTo=${site}`)
  }, [])

  const handleSignOut = useCallback(() => {
    props.onSignOut()
  }, [props.onSignOut])

  return <Base onClickSignIn={handleSignIn} onClickSignOut={handleSignOut} {...props} />
}

export default Navbar
