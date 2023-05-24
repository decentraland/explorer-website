import React from 'react'
import { Navbar as Base } from'decentraland-ui/dist/components/Navbar/Navbar'
import { JoinDiscord } from '../Button/JoinDiscord'

export type NavbarProps = {
  rightMenu?: React.ReactNode
}

export const Navbar = React.memo(function (props: NavbarProps) {
  return <Base
    isFullscreen
    rightMenu={props.rightMenu ?? <JoinDiscord />}
  />
})