import React from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Container, Details, Image, reload } from './Error'

import errorImage from '../../images/errors/robotsmiling.png'
import './errors.css'

export const ErrorNewLogin = React.memo(function () {
  return <Container id="error-new-login">
    <Details
      backgroundHeader="Oops!"
      header="Another session was detected"
      description={<>
        It seems that the explorer was opened with your account from another device, browser, or tab.
        <br />
        Please, close the prior session and click "Reload" to explore the world in this window.</>}>
      <Button primary onClick={reload}>Reload</Button>
    </Details>
    <Image alt="error-smiling-robot" src={errorImage} />
  </Container>
})
