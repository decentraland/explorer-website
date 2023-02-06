import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Hero } from 'decentraland-ui/dist/components/Hero/Hero'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { launchDesktopApp } from '../../integration/desktop'
import {
  isWindows,
  isMacOS,
  setDownloadModalShown,
  hasDownloadModalShown
} from '../../integration/browser'
import ModalImage from '../../images/dcl-modal-image.jpeg'
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
    if (platform && !hasDownloadModalShown()) {
      launchDesktopApp().then((launched) => {
        setOpen(!launched)
      })
    }
  }, [platform])

  const handleClose = useCallback(() => {
    setDownloadModalShown()
    setOpen(false)
  }, [])

  return (
    <Modal className="DownloadModal" open={open} closeIcon={<Close />} onClose={handleClose}>
      <Modal.Content>
        <div className="DownloadModal__ImageContainer" style={{ backgroundImage: `url(${ModalImage})` }}></div>
        <div className="DownloadModal__TextContainer">
          <Hero>
            <Hero.Header>
              Decentraland for <span>{platform}</span>
            </Hero.Header>
            <Hero.Content>
              With the Desktop Client, your visit to Decentraland will be <strong>faster</strong> and{' '}
              <strong>more stable</strong> with <strong>better performance and graphics.</strong>
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
