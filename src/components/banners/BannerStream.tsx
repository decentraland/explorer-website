import React from 'react'
import { BannerContainerProps } from './BannerContainer.types'
import { BannerWrap, BannerCloseButton, BannerText } from './banners.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export const BannerStream: React.FC<Pick<BannerContainerProps, 'onClose'>> = (props) => {
  const l = useFormatMessage()
  return (
    <BannerWrap id="banner-stream">
      <BannerCloseButton onClick={props.onClose} />
      <BannerText>
        {l('banner.stream')}
        <br />
        <a href="https://decentraland.org" rel="noreferrer noopener" target="_blank">
          {l('banner.stream_learn_more')}
        </a>
      </BannerText>
    </BannerWrap>
  )
}
