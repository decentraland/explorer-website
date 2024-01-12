import { connect } from 'react-redux'
import { isConnected, isConnecting, getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { LOAD_PROFILE_REQUEST } from 'decentraland-dapps/dist/modules/profile/actions'
import { getProfileOfAddress, getLoading, getError } from 'decentraland-dapps/dist/modules/profile/selectors'
import { StoreType } from '../../state/redux'
import { Props } from './Start.types'
import Start from './Start'

const mapStateToProps = (state: StoreType): Props => {
  const wallet = getWallet(state)

  return {
    wallet,
    isConnecting: isConnecting(state),
    isConnected: isConnected(state),
    isLoadingProfile: getLoading(state).some((a) => a.type === LOAD_PROFILE_REQUEST),
    profile: (wallet?.address && getProfileOfAddress(state, wallet?.address)) || null
  }
}

export default connect(mapStateToProps)(Start)
