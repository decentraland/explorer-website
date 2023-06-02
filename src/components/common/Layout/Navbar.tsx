import React, { useCallback } from 'react'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import { Navbar as Base } from 'decentraland-ui/dist/components/Navbar/Navbar'
import { JoinDiscord } from '../Button/JoinDiscord'
import { track } from '../../../utils/tracking'
import './Navbar.css'

export type NavbarProps = {
  rightMenu?: React.ReactNode
}

export const Navbar = React.memo(function (props: NavbarProps) {
  const handleClickMenuOption = useCallback((e: React.MouseEvent, section: string) => {
    const [menuSection, subMenuSection = undefined] = section.split('_')
    track('click_navbar_button', { section: menuSection, menu: subMenuSection })
  }, [])

  return (
    <Base
      isFullscreen
      onClickMenuOption={handleClickMenuOption}
      leftMenuDecorator={(props) => {
        return (
          <>
            <Menu.Item href="https://decentraland.org" onClick={(e) => handleClickMenuOption(e, 'home')}>
              HOME
            </Menu.Item>
            <Menu.Item active href="https://play.decentraland.org" onClick={(e) => e.preventDefault()}>
              PLAY
            </Menu.Item>
            {props.children}
          </>
        )
      }}
      rightMenu={props.rightMenu ?? <JoinDiscord />}
    />
  )
})
