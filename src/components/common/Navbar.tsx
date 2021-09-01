import React from 'react'
import { Logo } from './Logo'
import { Isologotipo } from './Isologotipo'
import { Discord } from './Icon.tsx/Discord'
import './Navbar.css'
import { Message } from 'decentraland-ui'
import { isRecommendedBrowser } from '../../utils/browser'

export type NavbarProps = {
  full?: boolean
  onClickLogo?: (event: React.MouseEvent<SVGElement>) => void
}

export const Navbar = (props: NavbarProps) => (
  <nav className="nav-bar">
    {props.full ? (
      <>
        <a href="https://decentraland.org/" target="_blank" rel="noopener noreferrer">
          <Logo onClick={props.onClickLogo} />
        </a>
        {
          isRecommendedBrowser() ? 
            '' : 
            <Message 
              warning 
              visible 
              content={'Unfortunately, your browser is not among the recommended choices for an optimal experience in Decentraland. We suggest you use one based on Chromium or Firefox.'} 
              header={'Unrecommended Browser'}/>
        }
        <div className="nav-bar-content">
          <div className="nav-text">
            <span>Need support?</span>
          </div>
          <a className="nav-discord" href="https://discord.gg/k5ydeZp" target="about:blank">
            <Discord />
            <div>Join our discord</div>
          </a>
        </div>
      </>
    ) : (
      <Isologotipo onClick={props.onClickLogo} />
    )}
  </nav>
)
