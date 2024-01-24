import { Dispatch } from 'redux'
import { DisconnectWalletAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'

export type Props = Pick<NavbarProps, 'avatar' | 'manaBalances' | 'address' | 'isSignedIn' | 'isSigningIn'> & {
  onSignOut: () => void
}

export type MapStateProps = Pick<Props, 'avatar' | 'manaBalances' | 'address' | 'isSignedIn' | 'isSigningIn'>
export type MapDispatchProps = Pick<Props, 'onSignOut'>
export type MapDispatch = Dispatch<DisconnectWalletAction>
