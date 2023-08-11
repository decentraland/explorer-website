import React from 'react'
import logoWhite from '../../images/logo-white.svg'
import './LogoContainer.css'

export default React.memo(function LogoContainer(props: Partial<{ loading: boolean }>) {
  return (
    <div className="LogoContainer">
      <img alt="decentraland" src={logoWhite} height="40" width="212" />
      {!props.loading && <p>Sign In or Create an Account</p>}
      {!!props.loading && <p>Loading...</p>}
    </div>
  )
})