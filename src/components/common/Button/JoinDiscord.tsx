import React from 'react'
import { Discord } from '../Icon/Discord'
import './JoinDiscord.css'

export const JoinDiscord = React.memo(function () {
  return <a className="JoinDiscord" rel="noopener noreferrer" target="_blank" href="https://decentraland.org/discord/">
    <Discord />
    <span>JOIN DISCORD</span>
  </a>
})