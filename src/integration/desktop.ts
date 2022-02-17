import { setDownloadNewVersion, setDownloadProgress, setDownloadReady, setKernelError } from '../state/actions'
import { store } from '../state/redux'
import { callOnce } from '../utils/callOnce'

export const isElectron = callOnce((): boolean => {
  // Renderer process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    (window.process as any).type === 'renderer'
  ) {
    return true
  }

  // Main process
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!(process.versions as any).electron) {
    return true
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true
  }

  return false
})

export const initializeDesktopApp = callOnce(() => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron')

    ipcRenderer.on('downloadState', (event: any, payload: any): any => {
      switch (payload.type) {
        case 'ERROR':
          store.dispatch(
            setKernelError({
              error: new Error(payload.message || 'Unknown launcher error')
            })
          )
          break
        case 'NEW_VERSION':
          store.dispatch(setDownloadNewVersion())
          event.sender.send('download')
          break
        case 'READY':
          store.dispatch(setDownloadReady())
          break
        case 'PROGRESS':
          store.dispatch(setDownloadProgress(payload.progress))
          break
      }
    })

    ipcRenderer.send('checkVersion')
    console.log('Electron found')
  }
})
