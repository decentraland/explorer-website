import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  isConnected,
  isConnecting,
  getAddress,
  getManaBalances
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { disconnectWallet } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { StoreType } from '../../../../state/redux'
import { MapStateProps, MapDispatchProps } from './Navbar.types'
import Navbar from './Navbar'

const mapState = (state: StoreType): MapStateProps => {
  const address = getAddress(state)
  const profile = address ? getProfiles(state)[address] : undefined
  return {
    avatar: profile ? profile.avatars[0] : undefined,
    manaBalances: getManaBalances(state),
    address: getAddress(state),
    isSignedIn: isConnected(state),
    isSigningIn: isConnecting(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onSignOut: () => dispatch(disconnectWallet())
})

export default connect(mapState, mapDispatch)(Navbar)
