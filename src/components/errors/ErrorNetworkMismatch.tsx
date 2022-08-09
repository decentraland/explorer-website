import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import errorImage from '../../images/errors/robotsmiling.png'
import { switchToChainId } from '../../eth/provider'
import './errors.css'

export interface ErrorNetworkMismatchProps {
  wantedChainId: ChainId
  providerChainId: ChainId
}

export const ErrorNetworkMismatch = React.memo(function (props: ErrorNetworkMismatchProps)  {
  const providerChainName = getChainName(props.providerChainId)
  const wantedChainName = getChainName(props.wantedChainId)
  return (
    <ErrorContainer id="error-network-mismatch">
      <ErrorDetails
        backgroundHeader="Oops!"
        header="Wrong network"
        description={
          <>
            You need to be connected to <strong>{wantedChainName}</strong> network to use this app, but you are
            currently connected to <strong>{providerChainName}</strong>
          </>
        }
      >
        <Button primary onClick={() => switchToChainId(props.wantedChainId, props.providerChainId)}>
          Switch to <strong>{wantedChainName}</strong>
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
