import React from 'react'
import { connect } from 'react-redux'
import { StoreType } from '../../state/redux'
import { FeatureFlags, getFeatureVariant, isMobile } from '../../state/selectors'

function mapStateToProps(state: StoreType): StreamContainerProps {
  return {
    src: getFeatureVariant(state, FeatureFlags.Stream),
    isMobile: isMobile(state),
    height: state.browser.height,
    width: state.browser.width,
  }
}

export interface StreamContainerProps {
  isMobile: boolean
  src?: string
  height: number
  width: number
}

const StreamContainer: React.FC<StreamContainerProps> = ({ isMobile, ...props}) => {
  if (!isMobile || !props.src) {
    return null
  }

  return <iframe title="Decentraland Stream" className="StreamContainer" {...props} allowFullScreen />
}

export default connect(mapStateToProps)(StreamContainer)
