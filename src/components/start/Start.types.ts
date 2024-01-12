import { Profile } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isConnected: boolean
  isConnecting: boolean
  isLoadingProfile: boolean
  profile: Profile | null
}
