import { Profile } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isConnected: boolean
  hasInitializedConnection: boolean
  initializeKernel: () => void
  isConnecting: boolean
  isLoadingProfile: boolean
  profile: Profile | null
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnected' | 'hasInitializedConnection' | 'isConnecting' | 'isLoadingProfile' | 'profile'
>
