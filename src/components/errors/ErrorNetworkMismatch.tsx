import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { reload } from "./utils"
import { NETWORK } from '../../integration/url'

import errorImage from '../../images/errors/robotsmiling.png'
import './errors.css'

export interface ErrorNetworkMismatchProps {
  details: string | null
  onLogout: () => void
}

export const ErrorNetworkMismatch = React.memo(function (props: ErrorNetworkMismatchProps)  {
  return <ErrorContainer id="error-network-mismatch">
    <ErrorDetails
      backgroundHeader="Oops!"
      header="A network mismatch was detected"
      description={<>
        We detected that you are trying to enter the <strong id="tld">{NETWORK || 'mainnet'}</strong> network, and
        your Ethereum wallet is set to other network.
        <br /><br />
        To continue, please change the Ethereum network in your wallet to <strong id="web3NetGoal">{NETWORK || 'mainnet'}</strong> and click "Reload".
        {props.details && <br />}
        {props.details && <>Details: {props.details}</>}
      </>}>
      <Button primary onClick={reload}>Retry</Button>
      <Button primary onClick={props.onLogout}>Log out</Button>
    </ErrorDetails>
    <ErrorImage alt="error-smiling-robot" src={errorImage} />
  </ErrorContainer>
})
