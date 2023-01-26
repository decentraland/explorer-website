import React from 'react'
import video from '../../../images/loading.mp4'
import './LoadingRender.css'

export const LoadingRender = React.memo(function () {
  return <div className="LoadingRender">
    <video src={video} loop width="150" height="150" muted autoPlay />
    <p>We are downloading the latest version of Decentraland. You'll be up and running in a few seconds!</p>
  </div>
})