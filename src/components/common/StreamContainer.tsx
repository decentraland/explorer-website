import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { StoreType } from '../../state/redux'
import { FeatureFlags, getFeatureVariant } from '../../state/selectors'
import './StreamContainer.css'

function mapStateToProps(state: StoreType): StreamContainerProps {
  return {
    src: getFeatureVariant(state, FeatureFlags.Stream),
  }
}

export interface StreamContainerProps {
  src?: string
}


function windowSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  }
}

const StreamContainer: React.FC<StreamContainerProps> = (props: StreamContainerProps) => {
  const size = useMemo(() => windowSize(), [])
  if (!props.src || size.height === 0 || size.width === 0) {
    return null
  }

  return <iframe title="Decentraland Stream" className="StreamContainer" {...props} width={size.width} height={size.height} allowFullScreen />
}

export default connect(mapStateToProps)(StreamContainer)
