import React, { useCallback } from 'react'
import { Button } from 'decentraland-ui2'
import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import errorImage from '../../images/errors/robotsmiling.png'
import { disconnect, switchToChainId } from '../../eth/provider'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export interface ErrorNetworkMismatchProps {
  wantedChainId: ChainId
  providerChainId: ChainId
  providerType: ProviderType
}

export const ErrorNetworkMismatch = React.memo(function (props: ErrorNetworkMismatchProps) {
  const l = useFormatMessage()
  const providerChainName = getChainName(props.providerChainId) ?? String(props.providerChainId)
  const wantedChainName = getChainName(props.wantedChainId) ?? String(props.wantedChainId)

  const handleSwitchTo = useCallback(
    async function () {
      // Switch to the wanted network if using certain providers.
      if (
        [
          ProviderType.INJECTED,
          ProviderType.WALLET_CONNECT_V2,
          ProviderType.AUTH_SERVER,
          ProviderType.MAGIC,
          // TODO: Remove MAGIC_TEST when we have a proper provider for it
          ProviderType.MAGIC_TEST
        ].includes(props.providerType)
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
        backgroundHeader={l('errors.oops')}
        header={l('errors.network_mismatch_title')}
        description={l('errors.network_mismatch_description', { wanted: wantedChainName, current: providerChainName })}
      >
        <Button variant="contained" color="primary" onClick={handleSwitchTo}>
          {l('errors.network_mismatch_cta', { wanted: wantedChainName })}
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
