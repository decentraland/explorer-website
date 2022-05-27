import React from 'react'
import { ErrorContainer } from './Error'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import errorImage from '../../images/errors/error-robotmobile.png'


export const ErrorNoMobile = React.memo(function () {
  return <ErrorContainer id="error-no-mobile">
        <div className="error-no-mobile-title">The client is only available on desktop right now.</div>
        <div className="error-no-mobile-image">
          <img alt="no-mobile" width="495" height="707" src={errorImage} />
        </div>
        <div className="error-no-mobile-cta">
          <Button primary as="a" href="https://decentraland.org">Learn more about decentraland</Button>
        </div>
  </ErrorContainer>
})
