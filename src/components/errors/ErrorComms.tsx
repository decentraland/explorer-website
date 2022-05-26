import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import errorImage from '../../images/errors/error-robotdown.png'
import { Container, Details, Image, reload } from './Error'
import './errors.css'

export const ErrorComms = React.memo(function () {
  return <Container id="error-comms">
    <Details
      backgroundHeader="Oops!"
      header={<> A communication link could not be <br /> established with other peers</>}
      description={<>
        This might be because you are behind a restrictive network firewall, or a temporary problem with the selected realm. <br />
        <br />
        If you have any ad blocking extensions try turning them off for this site, and then reload.
        <br />
        You can also try a different realm.
      </>}>
      <Button primary onClick={reload}>Reload</Button>
    </Details>
    <Image alt="error-down-robot" src={errorImage} />
  </Container>
})
