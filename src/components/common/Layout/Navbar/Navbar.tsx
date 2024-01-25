import { useCallback } from 'react'
import { Navbar as Base } from 'decentraland-ui/dist/components/Navbar/Navbar'

const Navbar = (props: any) => {
  const handleSignIn = useCallback(() => {
    const site = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/play' : ''
    window.location.replace(`/auth/login?redirectTo=${site}`)
  }, [])

  const handleSignOut = useCallback(() => {
    props.onSignOut()
  }, [props.onSignOut])

  return <Base onClickSignIn={handleSignIn} onClickSignOut={handleSignOut} activePage="play" {...props} />
}

export default Navbar
