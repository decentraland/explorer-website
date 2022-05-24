import React from 'react'
import { Container, Details, Image } from './Error'
import errorImage from '../../images/errors/error-robotmobile.png'

export const ErrorAvatarLoading = React.memo(function () {
  return <Container id="error-avatarerror">
    <Details
      backgroundHeader="Oops!"
      header="There was a technical issue and we were unable to retrieve your avatar information"
      description={<>
        Please try again later, and if the problem persists you can contact us through the Discord channel or at{' '}
        <a href="mailto:hello@decentraland.org">hello@decentraland.org</a>
      </>}
    />
    <Image src={errorImage} />
  </Container>
})
