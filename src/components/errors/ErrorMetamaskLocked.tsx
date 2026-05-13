import React from 'react'
import { Button } from 'decentraland-ui2'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { useFormatMessage } from '../../hooks/useFormatMessage'

import errorImage from '../../images/errors/robotsmiling.png'

export interface ErrorNetworkMismatchProps {
  details: string | null
  closeError(): void
}

export const ErrorMetamaskLocked = React.memo(function (props: ErrorNetworkMismatchProps) {
  const l = useFormatMessage()
  return (
    <ErrorContainer id="error-metamask-locked">
      <ErrorDetails header={l('errors.metamask_locked_title')} description={props.details}>
        <Button variant="contained" color="primary" onClick={props.closeError}>
          {l('errors.metamask_locked_cta')}
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
