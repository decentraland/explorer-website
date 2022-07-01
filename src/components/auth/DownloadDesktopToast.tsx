import React, { useMemo } from 'react'
import { isElectron } from '../../integration/desktop'
import { isWindows } from '../../integration/browser'
import './DownloadDesktopToast.css'

export const DownloadDesktopToast = React.memo(() => {
  const wrapperClassname = useMemo(
    () => (!isElectron() && isWindows() ? 'ShowDownloadDesktopToast' : 'HideDownloadDesktopToast'),
    []
  )
  return (
    <div className={wrapperClassname}>
      <a
        className="DownloadDesktopApp"
        href="https://decentraland.org/download/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Want to play on windows? <span>Download the desktop client</span>
      </a>
    </div>
  )
})
