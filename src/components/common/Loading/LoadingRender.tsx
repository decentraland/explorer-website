import React from 'react'
import './LoadingRender.css'

export const LoadingRender = React.memo(function () {
  return <div className="LoadingRender">
    <img src="./images/loading.gif" width="150" height="150" />
    <p>We are downloading the client. We will be ready in a second :P</p>
  </div>
})