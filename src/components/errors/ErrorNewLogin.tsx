import React from 'react'
import { Button } from 'decentraland-ui2'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { reload } from './utils'
import { useFormatMessage } from '../../hooks/useFormatMessage'

import errorImage from '../../images/errors/robotsmiling.png'

export const ErrorNewLogin = React.memo(function () {
  const l = useFormatMessage()
  return (
    <ErrorContainer id="error-new-login">
      <ErrorDetails
        backgroundHeader={l('errors.oops')}
        header={l('errors.new_login_title')}
        description={
          <>
            {l('errors.new_login_description_part1')}
            <br />
            {l('errors.new_login_description_part2')}
          </>
        }
      >
        <Button variant="contained" color="primary" onClick={reload}>
          {l('errors.reload')}
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-smiling-robot" src={errorImage} />
    </ErrorContainer>
  )
})
