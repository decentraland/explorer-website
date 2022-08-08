import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import errorImage from '../../images/errors/robotsmiling.png'
import { switchToChainId } from '../../eth/provider'
import './errors.css'
import { getChainName } from '@dcl/schemas/dist/dapps/chain-id'

export interface ErrorNetworkMismatchProps {
  details: string
  extra: Record<string, any>
}

export const ErrorNetworkMismatch = React.memo(function (props: ErrorNetworkMismatchProps)  {
  const providerChainName = getChainName(props.extra.providerChainId)
  const wantedChainName = getChainName(props.extra.wantedChainId)
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
        <Button primary onClick={() => switchToChainId(props.extra.wantedChainId)}>
          Switch to <strong>{wantedChainName}</strong>
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
