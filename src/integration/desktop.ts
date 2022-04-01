import { setDownloadNewVersion, setDownloadProgress, setDownloadReady, setKernelError } from '../state/actions'
import { store } from '../state/redux'
import { callOnce } from '../utils/callOnce'
import { parsePosition } from '../utils/parsePosition'
import { getCurrentPosition, isMobile } from './browser'

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

export async function launchDesktopApp() {
  if (isElectron() || isMobile()) {
    return false
  }

  const data = getCurrentPosition()
  if (!data.position) {
    return false
  }

  const position = parsePosition(data.position)
  if (!position) {
    return false
  }

  let installed = true
  const isInstalled = () => { installed = false }
  const [x, y] = position

  window.addEventListener('blur', isInstalled);
  const iframe = document.createElement('iframe')
  iframe.setAttribute('style', 'display: none')
  iframe.src = `dcl://position=${x},${y}`

  document.body.appendChild(iframe)
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      window.removeEventListener('blur', isInstalled)
      document.body.removeChild(iframe)
      resolve(installed)
    }, 500);
  })
}
