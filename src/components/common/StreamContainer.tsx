import React, { useEffect, useState } from 'react'
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
  const [ size, setSize ] = useState(() => ({ height: 0, width: 0 }))
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.className += ' full'
    }

    const resize = () => setSize(windowSize())
    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (root) {
        root.className = root.className.replace(' full', '')
      }
    }
  }, [])

  if (!props.src || size.height === 0 || size.width === 0) {
    return null
  }

  return <div className="StreamContainer">
    <iframe title="Decentraland Stream" {...props} width={size.width} height={size.height} allowFullScreen />
  </div>
}

export default connect(mapStateToProps)(StreamContainer)
