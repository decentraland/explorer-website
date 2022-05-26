import React from 'react'
import { Container, Details, Image } from './Error'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import errorImage from '../../images/errors/robotsmiling.png'
import './errors.css'

export interface ErrorNetworkMismatchProps {
  details: string | null
  closeError(): void
}

export const ErrorMetamaskLocked = React.memo(function (props: ErrorNetworkMismatchProps) {
  return <Container id="error-metamask-locked">
    <Details
      header="Before we continue"
      description={props.details}>
        <Button primary onClick={props.closeError}>Retry</Button>
      </Details>
    <Image alt="error-smiling-robot" src={errorImage} />
  </Container>
})
