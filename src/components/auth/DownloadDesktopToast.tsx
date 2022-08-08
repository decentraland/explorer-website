import React, { useMemo } from 'react'
import { isElectron } from '../../integration/desktop'
import { isWindows, isMacOS } from '../../integration/browser'
import './DownloadDesktopToast.css'

export const DownloadDesktopToast = React.memo(() => {
  const platform = useMemo(() => {
    if (isWindows()) {
      return 'windows'
    } else if (isMacOS()) {
      return 'mac'
    } else {
      return null
    }
  }, [])

  const wrapperClassName = useMemo(
    () => !isElectron() && !!platform ? 'ShowDownloadDesktopToast' : 'HideDownloadDesktopToast',
    [platform]
  )

  return (
    <div className={wrapperClassName}>
      <a
        className="DownloadDesktopApp"
        href="https://decentraland.org/download/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Want to play on {platform}? <span>Download the desktop client</span>
      </a>
    </div>
  )
})
