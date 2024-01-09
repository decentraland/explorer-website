import React, { useCallback } from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import errorImage from '../../images/errors/robotsmiling.png'
import { disconnect, switchToChainId } from '../../eth/provider'
import './errors.css'

export interface ErrorNetworkMismatchProps {
  wantedChainId: ChainId
  providerChainId: ChainId
  providerType: ProviderType
}

export const ErrorNetworkMismatch = React.memo(function (props: ErrorNetworkMismatchProps) {
  const providerChainName = getChainName(props.providerChainId)
  const wantedChainName = getChainName(props.wantedChainId)

  const handleSwitchTo = useCallback(
    async function () {
      // Switch to the wanted network if using certain providers.
      if (
        [ProviderType.INJECTED, ProviderType.WALLET_CONNECT_V2, ProviderType.AUTH_SERVER].includes(props.providerType)
      ) {
        try {
          await switchToChainId(props.wantedChainId, props.providerChainId)
        } catch (e) {
          console.warn('Error switching chain')
        }
      } else {
        await disconnect()
      }

      window.location.reload()
    },
    [props.wantedChainId, props.providerChainId, props.providerType]
  )

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
        <Button primary onClick={handleSwitchTo}>
          Switch to <strong>{wantedChainName}</strong>
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
