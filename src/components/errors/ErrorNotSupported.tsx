import React from 'react'
import errorImage from '../../images/errors/error-robotmobile.png'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export const ErrorNotSupported = React.memo(function () {
  const l = useFormatMessage()
  return (
    <ErrorContainer id="error-not-supported">
      <ErrorDetails
        backgroundHeader={l('errors.error_label')}
        header={l('errors.not_supported_title')}
        description={l('errors.not_supported_description')}
      />
      <ErrorImage alt="error-mobile-robot" src={errorImage} />
    </ErrorContainer>
  )
})
