import React from 'react'
import errorImage from '../../images/errors/error-robotmobile.png'
import { Container, Details, Image } from './Error'
import './errors.css'

export const ErrorNotSupported = React.memo(function () {
  return <Container id="error-new-login">
    <Details
      backgroundHeader="Error"
      header="Your browser or device is not supported"
      description="The Explorer only works on Chrome or Firefox for Windows, Linux and macOS."
      />
    <Image src={errorImage} />
  </Container>
})
