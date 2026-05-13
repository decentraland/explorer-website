import React from 'react'
import { BannerContainerProps } from './BannerContainer.types'
import { BannerWrap, BannerCloseButton, BannerText } from './banners.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export const BannerNotSupported: React.FC<Pick<BannerContainerProps, 'onClose'>> = (props) => {
  const l = useFormatMessage()
  return (
    <BannerWrap id="banner-notsupported">
      <BannerCloseButton onClick={props.onClose} />
      <BannerText>
        {l('banner.not_supported_prefix')}{' '}
        <a href="https://www.google.com/chrome/" rel="noreferrer noopener" target="_blank">
          {l('banner.chromium')}
        </a>{' '}
        {l('banner.not_supported_or')}{' '}
        <a href="https://www.mozilla.org/en-US/firefox/new/" rel="noreferrer noopener" target="_blank">
          {l('banner.firefox')}
        </a>
        .
      </BannerText>
    </BannerWrap>
  )
}
