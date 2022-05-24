import React from 'react'
import { Container, Details, Image, reload } from './Error'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import errorImage from '../../images/errors/error-robotdown.png'
import './errors.css'

const defaultDetails: React.ReactNode = <>
  <div>If you have any ad blocking extensions,</div>
  <div>try turning them off for this site.</div>
  <div />
  <div>Loading should not take any longer than 2-3 minutes.</div>
  <div>If you seem to be stuck, make sure hardware acceleration is on.</div>
  <a href="https://docs.decentraland.org/decentraland/hardware-acceleration/">LEARN MORE</a>
</>

export type ErrorFatalProps = {
  details?: React.ReactNode
}

export const ErrorFatal = React.memo(function (props: ErrorFatalProps) {
  return <Container id="error-fatal">
    <Details
      backgroundHeader="Oops!"
      header="Something went wrong"
      description={props.details || defaultDetails}>
        <Button primary onClick={reload}>Reload</Button>
      </Details>
    <Image src={errorImage} />
  </Container>
})
