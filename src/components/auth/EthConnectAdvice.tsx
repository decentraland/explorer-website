import React from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'

export type EthWalletSelectorAdviceProps = {
  provider?: ProviderType
  style?: React.CSSProperties
}

export const EthConnectAdvice = React.memo((props: EthWalletSelectorAdviceProps) => {
  switch (props.provider) {
    case ProviderType.FORTMATIC:
      return (
        <span className="EthConnectAdvice" style={props.style}>
          Please, follow the instructions of your fortmatic provider to continue.
        </span>
      )

    case ProviderType.INJECTED:
      return (
        <span className="EthConnectAdvice" style={props.style}>
          Please, follow the instructions of your browser wallet provider to continue.
        </span>
      )

    case ProviderType.WALLET_CONNECT_V2:
      return (
        <span className="EthConnectAdvice" style={props.style}>
          Please follow the instructions from your wallet provider's app on your mobile device to continue.
        </span>
      )

    default:
      return null
  }
})
