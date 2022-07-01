import React from 'react'
import { StoreType } from '../../state/redux'
import logoWhite from '../../images/logo-white.svg'
import { FeatureFlags, getFeatureVariantName, VariantNames } from '../../state/selectors'
import { isElectron } from '../../integration/desktop'
import { connect } from 'react-redux'
import './LogoContainer.css'


const mapStateToProps = (state: StoreType): LogoContainerProps => {
  return {
    isSignInFlowV3: getFeatureVariantName(state, FeatureFlags.SignInFlowV3) === VariantNames.New && !isElectron()
  }
}

export interface LogoContainerProps {
  isSignInFlowV3: boolean
}

export const LogoContainer: React.FC<LogoContainerProps> = ({ isSignInFlowV3 }) => {
  if (isSignInFlowV3) {
    return (
      <div className="LogoContainer LogoContainerNew">
        <img alt="decentraland" src={logoWhite} width="257" />
        <p>Explore the first decentralized metaverse that is built and owned by its users</p>
      </div>
    )
  }

  return (
    <div className="LogoContainer">
      <img alt="decentraland" src={logoWhite} height="40" width="212" />
      <p>Sign In or Create an Account</p>
    </div>
  )
}

export default connect(mapStateToProps)(LogoContainer)