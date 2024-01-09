import { all } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { getWantedChainId } from '../kernel-loader'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: getWantedChainId()
})

export function* rootSaga() {
  yield all([baseWalletSaga()])
}
