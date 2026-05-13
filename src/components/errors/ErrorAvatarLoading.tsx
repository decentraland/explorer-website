import React from 'react'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import errorImage from '../../images/errors/error-robotmobile.png'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export const ErrorAvatarLoading = React.memo(function () {
  const l = useFormatMessage()
  const email = l('errors.avatar_email')
  return (
    <ErrorContainer id="error-avatarerror">
      <ErrorDetails
        backgroundHeader={l('errors.oops')}
        header={l('errors.avatar_title')}
        description={
          <>
            {l('errors.avatar_description')} <a href={`mailto:${email}`}>{email}</a>
          </>
        }
      />
      <ErrorImage alt="error-mobile-robot" src={errorImage} />
    </ErrorContainer>
  )
})
