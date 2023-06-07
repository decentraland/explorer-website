import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useMobileResize } from '../../integration/mobile'
import { StoreType } from '../../state/redux'
import { FeatureFlags, getFeatureVariant } from '../../state/selectors'
import { BannerStream } from '../banners/BannerStream'
import './StreamContainer.css'

function mapStateToProps(state: StoreType): StreamContainerProps {
  return {
    src: getFeatureVariant(state, FeatureFlags.Stream),
  }
}

export interface StreamContainerProps {
  src?: string
}

const StreamContainer: React.FC<StreamContainerProps> = (props: StreamContainerProps) => {
  const [ banner, setBanner ] = useState(true)
  const size = useMobileResize()

  if (!props.src || size.height === 0 || size.width === 0) {
    return null
  }

  return <div className="StreamContainer">
    {banner && <BannerStream onClose={() => setBanner(false)} />}
    <iframe title="Decentraland Stream" src={props.src} width={size.width} height={size.height} allowFullScreen />
  </div>
}

export default connect(mapStateToProps)(StreamContainer)
