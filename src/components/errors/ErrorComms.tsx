import React from 'react'
import { Button } from 'decentraland-ui2'
import errorImage from '../../images/errors/error-robotdown.png'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { reload } from './utils'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export const ErrorComms = React.memo(function () {
  const l = useFormatMessage()
  return (
    <ErrorContainer id="error-comms">
      <ErrorDetails
        backgroundHeader={l('errors.oops')}
        header={
          <>
            {l('errors.comms_title_part1')} <br /> {l('errors.comms_title_part2')}
          </>
        }
        description={
          <>
            {l('errors.comms_description_part1')} <br />
            <br />
            {l('errors.comms_description_part2')}
            <br />
            {l('errors.comms_description_part3')}
          </>
        }
      >
        <Button variant="contained" color="primary" onClick={reload}>
          {l('errors.reload')}
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-down-robot" src={errorImage} />
    </ErrorContainer>
  )
})
