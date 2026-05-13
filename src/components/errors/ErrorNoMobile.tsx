import React from 'react'
import { Button } from 'decentraland-ui2'
import { ErrorContainer } from './Error'
import { NoMobileTitle, NoMobileImage } from './Error.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import errorImage from '../../images/errors/error-robotmobile.png'

export const ErrorNoMobile = React.memo(function () {
  const l = useFormatMessage()
  return (
    <ErrorContainer id="error-no-mobile">
      <NoMobileTitle>{l('errors.no_mobile_title')}</NoMobileTitle>
      <NoMobileImage>
        <img alt="no-mobile" width="495" height="707" src={errorImage} />
      </NoMobileImage>
      <div>
        <Button variant="contained" color="primary" href="https://decentraland.org">
          {l('errors.no_mobile_cta')}
        </Button>
      </div>
    </ErrorContainer>
  )
})
