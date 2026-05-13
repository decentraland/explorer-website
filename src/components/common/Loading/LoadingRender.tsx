import React from 'react'
import video from '../../../images/loading.mp4'
import { LoadingEl, LoadingVideo, LoadingCaption } from './LoadingRender.styled'
import { useFormatMessage } from '../../../hooks/useFormatMessage'

export const LoadingRender = React.memo(function () {
  const l = useFormatMessage()
  return (
    <LoadingEl>
      <LoadingVideo src={video} loop width="150" height="150" muted autoPlay />
      <LoadingCaption>{l('loading.downloading')}</LoadingCaption>
    </LoadingEl>
  )
})
