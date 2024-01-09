import { connect } from 'react-redux'
import { isConnected, isConnecting, getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getProfileOfAddress } from 'decentraland-dapps/dist/modules/profile/selectors'
import { StoreType } from '../../state/redux'
import { Props } from './Start.types'
import Start from './Start'

const mapStateToProps = (state: StoreType): Props => {
  const wallet = getWallet(state)
  return {
    wallet,
    isConnecting: isConnecting(state),
    isConnected: isConnected(state),
    profile: (wallet?.address && getProfileOfAddress(state, wallet?.address)) || null
  }
}

export default connect(mapStateToProps)(Start)
