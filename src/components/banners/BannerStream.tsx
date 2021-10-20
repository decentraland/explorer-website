import React from 'react'
import { BannerContainerProps } from './BannerContainer.types'

import './banners.css'

export const BannerStream: React.FC<Pick<BannerContainerProps, 'onClose'>> = (props) => (
  <div id="banner-stream" className="banner-container">
    <div className="banner-close-button" onClick={props.onClose} />
    <div className="banner-text">
      The client is only available on desktop right now.
        {' '}
        <a href="https://decentraland.org" rel="noreferrer noopener" target="_blank">Learn more about decentraland</a>
    </div>
  </div>
)
