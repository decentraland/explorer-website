import React from 'react'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'

export type EthWalletSelectorAdviceProps = {
  provider?: ProviderType
  style?: React.CSSProperties
}

export const EthConnectAdvice = React.memo((props: EthWalletSelectorAdviceProps) => {
  switch (props.provider) {
    case ProviderType.FORTMATIC:
      return <span className="EthConnectAdvice" style={props.style}>
        Please, follow the instructions of your fortmatic provider to continue.
      </span>

    case ProviderType.INJECTED:
      return <span className="EthConnectAdvice" style={props.style}>
        Please, follow the instructions of your browser wallet provider to continue.
      </span>

    case ProviderType.WALLET_CONNECT:
      return <span className="EthConnectAdvice" style={props.style}>
        Please, follow the instructions of your mobile wallet provider to continue.
      </span>

    default:
      return null
  }
})