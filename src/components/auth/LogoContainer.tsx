import React from 'react'
import logoWhite from '../../images/logo-white.svg'
import { LogoEl } from './LogoContainer.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export default React.memo(function LogoContainer(props: Partial<{ loading: boolean }>) {
  const l = useFormatMessage()
  return (
    <LogoEl className="LogoContainer">
      <img alt="decentraland" src={logoWhite} height="40" width="212" />
      {!props.loading && <p>{l('logo.sign_in')}</p>}
      {!!props.loading && <p>{l('logo.loading')}</p>}
    </LogoEl>
  )
})
