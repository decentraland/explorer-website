import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Hero } from 'decentraland-ui/dist/components/Hero/Hero'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { launchDesktopApp } from '../../integration/desktop'
import {
  isWindows,
  isMacOS,
  setAsRecentlyDownloadModalShown,
  hasRecentlyDownloadModalShown
} from '../../integration/browser'
import FollowTheWhiteRabbit from '../../images/follow-the-white-rabbit.jpeg'
import './DownloadModal.css'

export const DownloadModal = React.memo(() => {
  const platform = useMemo(() => {
    if (isWindows()) {
      return 'windows'
    } else if (isMacOS()) {
      return 'mac'
    } else {
      return null
    }
  }, [])

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (platform && !hasRecentlyDownloadModalShown()) {
      launchDesktopApp().then((launched) => {
        setOpen(!launched)
      })
    }
  }, [platform])

  const handleClose = useCallback(() => {
    setAsRecentlyDownloadModalShown()
    setOpen(false)
  }, [])

  return (
    <Modal className="DownloadModal" open={open} closeIcon={<Close />} onClose={handleClose}>
      <Modal.Content>
        <div
          className="DownloadModal__ImageContainer"
          style={{ backgroundImage: `url(${FollowTheWhiteRabbit})` }}
        ></div>
        <div className="DownloadModal__TextContainer">
          <Hero>
            <Hero.Description>Decentraland for {platform}</Hero.Description>
            <Hero.Header>The Best Festival Experience</Hero.Header>
            <Hero.Content>
              With the Desktop Client, your visit to Decentraland Metaverse Music Festival will be{' '}
              <strong>faster</strong> and <strong>more stable</strong> with{' '}
              <strong>better performance and graphics.</strong>
            </Hero.Content>
            <Hero.Actions>
              <Button primary as="a" href="https://decentraland.org/download/" target="_blank">
                Download
              </Button>
            </Hero.Actions>
          </Hero>
        </div>
      </Modal.Content>
    </Modal>
  )
})
