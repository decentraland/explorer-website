import React from 'react'
import { StoreType } from '../../state/redux'
import logoWhite from '../../images/logo-white.svg'
import { FeatureFlags, getFeatureVariantName, VariantNames } from '../../state/selectors'
import { isElectron } from '../../integration/desktop'
import { connect } from 'react-redux'
import './LogoContainer.css'


const mapStateToProps = (state: StoreType): LogoContainerProps => {
  return {}
}

export interface LogoContainerProps {}

export const LogoContainer: React.FC<LogoContainerProps> = ({}) => {
  return (
    <div className="LogoContainer">
      <img alt="decentraland" src={logoWhite} height="40" width="212" />
      <p>Sign In or Create an Account</p>
    </div>
  )
}

export default connect(mapStateToProps)(LogoContainer)