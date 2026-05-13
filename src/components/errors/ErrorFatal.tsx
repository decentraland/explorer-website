import React from 'react'
import { Button } from 'decentraland-ui2'
import { ErrorContainer, ErrorDetails, ErrorImage } from './Error'
import { reload } from './utils'
import { useFormatMessage } from '../../hooks/useFormatMessage'

import errorImage from '../../images/errors/error-robotdown.png'

export type ErrorFatalProps = {
  details?: React.ReactNode
}

export const ErrorFatal = React.memo(function (props: ErrorFatalProps) {
  const l = useFormatMessage()
  const defaultDetails: React.ReactNode = (
    <>
      <div>{l('errors.fatal_default_line1')}</div>
      <div>{l('errors.fatal_default_line2')}</div>
      <div />
      <div>{l('errors.fatal_default_line3')}</div>
      <div>{l('errors.fatal_default_line4')}</div>
      <a href="https://docs.decentraland.org/decentraland/hardware-acceleration/">{l('errors.fatal_learn_more')}</a>
    </>
  )
  return (
    <ErrorContainer id="error-fatal">
      <ErrorDetails
        backgroundHeader={l('errors.oops')}
        header={l('errors.fatal_title')}
        description={props.details || defaultDetails}
      >
        <Button variant="contained" color="primary" onClick={reload}>
          {l('errors.reload')}
        </Button>
      </ErrorDetails>
      <ErrorImage alt="error-down-robot" src={errorImage} />
    </ErrorContainer>
  )
})
