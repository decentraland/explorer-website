import { connect } from 'react-redux'
import { isConnected, isConnecting, getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { StoreType } from '../../state/redux'
import { Props } from './Start.types'
import Start from './Start'

const mapStateToProps = (state: StoreType): Props => {
  return {
    wallet: getWallet(state),
    isConnecting: isConnecting(state),
    isConnected: isConnected(state),
  }
}

export default connect(mapStateToProps)(Start)
