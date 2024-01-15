import { connect } from 'react-redux'
import {
  isConnected,
  isConnecting,
  getData as getWallet,
  getError
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { LOAD_PROFILE_REQUEST } from 'decentraland-dapps/dist/modules/profile/actions'
import { getProfileOfAddress, getLoading } from 'decentraland-dapps/dist/modules/profile/selectors'
import { StoreType } from '../../state/redux'
import { MapStateProps } from './Start.types'
import Start from './Start'

const mapStateToProps = (state: StoreType): MapStateProps => {
  const wallet = getWallet(state)
  const isWalletConnected = isConnected(state)
  const isWalletConnecting = isConnecting(state)

  return {
    wallet,
    isConnecting: isWalletConnecting,
    isConnected: isWalletConnected,
    hasInitializedConnection: getError(state) !== null || isWalletConnected || isWalletConnecting,
    isLoadingProfile: getLoading(state).some((a) => a.type === LOAD_PROFILE_REQUEST),
    profile: (wallet?.address && getProfileOfAddress(state, wallet?.address)) || null
  }
}

export default connect(mapStateToProps)(Start)
