import { all } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { getWantedChainId } from '../kernel-loader'

const PEER_URL = window.location.origin.includes('decentraland.org')
  ? 'https://peer.decentraland.org'
  : 'https://peer.decentraland.zone'

const baseProfileSaga = createProfileSaga({ peerUrl: PEER_URL, getIdentity: () => undefined })

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: getWantedChainId()
})

export function* rootSaga() {
  yield all([baseWalletSaga(), baseProfileSaga()])
}
