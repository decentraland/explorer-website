import React from 'react'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import errorImage from '../../images/errors/robotsmiling.png'
import './errors.css'

export interface ErrorNetworkMismatchProps {
  details: string | null
  closeError(): void
}

export const ErrorMetamaskLocked = React.memo(function (props: ErrorNetworkMismatchProps) {
  return <ErrorContainer id="error-metamask-locked">
    <ErrorDetails
      header="Before we continue"
      description={props.details}>
        <Button primary onClick={props.closeError}>Retry</Button>
      </ErrorDetails>
    <ErrorImage alt="error-smiling-robot" src={errorImage} />
  </ErrorContainer>
})
