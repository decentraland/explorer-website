import React from 'react'
import errorImage from '../../images/errors/error-robotmobile.png'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import './errors.css'

export const ErrorNotSupported = React.memo(function () {
  return <ErrorContainer id="error-new-login">
    <ErrorDetails
      backgroundHeader="Error"
      header="Your browser or device is not supported"
      description="The Explorer only works on Chrome or Firefox for Windows, Linux and macOS."
      />
    <ErrorImage alt="error-mobile-robot" src={errorImage} />
  </ErrorContainer>
})
