import { setDownloadNewVersion, setDownloadProgress, setDownloadReady, setKernelError } from '../state/actions'
import { store } from '../state/redux'
import { callOnce } from '../utils/callOnce'
import { getCurrentPosition, hasRecentlyLoggedIn, isMobile } from './browser'

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
  if (isElectron() && (window as any).electron) {
    const ipcRenderer = (window as any).electron.ipcRenderer

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

/**
 * Try to launch the desktop version using the custom protocol `dcl://position=x,y&realm=zzz`
 * and return a boolean that represents if a loss of focus was detected on the current window
 * (assuming it was due to the interaction generated by the desktop version)
 */
export async function launchDesktopApp() {
  // prevent launch for desktop and mobile
  if (isElectron() || isMobile()) {
    return false
  }

  // prevent launch if the user logged in into the web version recently
  if (hasRecentlyLoggedIn()) {
    return false
  }

  // build custom protocol target using current url `position` and `realm`
  const data = getCurrentPosition()
  let customProtocolParams: string [] = []
  if (data.position) {
    customProtocolParams.push(`position=${data.position}`)
  }

  if (data.realm) {
    customProtocolParams.push(`realm=${data.realm}`)
  }

  const customProtocolTarget = `dcl://${customProtocolParams.join('&')}`

  // assume that the desktop version is installed only if
  // we detect a loss of focus on window
  let installed = false
  const isInstalled = () => { installed = true }
  window.addEventListener('blur', isInstalled);

  // inject an iframe that open the desktop version
  // NOTE: this can be also achieved with
  // ```js
  //   window.location.href = customProtocolTarget
  // ```
  // but in safari redirects into an invalid url if the desktop
  // client is not installed
  const iframe = document.createElement('iframe')
  iframe.setAttribute('style', 'display: none')
  iframe.src = customProtocolTarget
  document.body.appendChild(iframe)

  // wait half of a second to detect the loss of focus because
  // the time it takes for the `blur` event to be fired varies
  // depending on the browser
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      window.removeEventListener('blur', isInstalled)
      document.body.removeChild(iframe)
      resolve(installed)
    }, 500);
  })
}
