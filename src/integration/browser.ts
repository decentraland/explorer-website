import { detect } from 'detect-browser'
import { setBanner } from '../state/actions'
import { BannerType, store } from '../state/redux'
import { callOnce } from '../utils/callOnce'

export const initializeBrowserRecommendation = callOnce(() => {
  if (!isRecommendedBrowser()) {
    store.dispatch(setBanner(BannerType.NOT_RECOMMENDED))
  }
})

export const isMobile = callOnce(() => {
  if (/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
    return true
  }

  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true
  }

  if (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
    // iPad pro
    return true
  }

  return false
})

export const isRecommendedBrowser = callOnce(() => {
  const detected = detect(navigator.userAgent)

  if (!detected) {
    return false
  }

  switch (detected.name) {
    case 'chrome':
    case 'chromium-webview':
    case 'edge-chromium':
    case 'firefox':
    case 'opera':
      return true

    default:
      return false
  }
})

const BROWSER_LAST_SESSION_KEY = 'dcl-last-session-at'
const BROWSER_LAST_DOWNLOAD_MODAL_SHOWN_KEY = 'dcl-last-download-modal-shown-at'
export const BROWSER_LAST_SESSION_EXPIRATION = 1000 * 60 * 60 * 24 * 7 /* one week */

export const hasRecentlyLoggedIn = callOnce(() => {
  const lastLoginAt = Number(localStorage.getItem(BROWSER_LAST_SESSION_KEY))
  if (Number.isNaN(lastLoginAt)) {
    return false
  }

  return lastLoginAt + BROWSER_LAST_SESSION_EXPIRATION > Date.now()
})

export const hasDownloadModalShown = callOnce(() => {
  const lastLoginAt = Number(localStorage.getItem(BROWSER_LAST_DOWNLOAD_MODAL_SHOWN_KEY))
  return !!lastLoginAt
})

export function setAsRecentlyLoggedIn() {
  localStorage.setItem(BROWSER_LAST_SESSION_KEY, String(Date.now()))
}

export function setDownloadModalShown() {
  localStorage.setItem(BROWSER_LAST_DOWNLOAD_MODAL_SHOWN_KEY, String(Date.now()))
}

export function isWindows() {
  if ((navigator as any).userAgentData?.platform === 'Windows') {
    return true
  }

  if (/Windows/gi.test(navigator.userAgent)) {
    return true
  }

  if (navigator.platform === 'Win32' || navigator.platform === 'Win64') {
    return true
  }

  return false
}

export function isMacOS() {
  if ((navigator as any).userAgentData?.platform === 'macOS') {
    return true
  }

  if (/Macintosh/gi.test(navigator.userAgent)) {
    return true
  }

  if (navigator.platform === 'MacIntel') {
    return true
  }

  return false
}

export type ExplorerLaunchParameters = Partial<{
  realm: string | undefined
  position: string | undefined
  'self-preview-builder-collections': string | undefined
  dclenv: string | undefined
}>

export function getExplorerLaunchParameters() {
  const data: ExplorerLaunchParameters = {}
  const qs = new URLSearchParams(globalThis.location.search || '')

  const realm = qs.get('realm')
  const position = qs.get('position')
  const selfPreviewBuilderCollections = qs.get('self-preview-builder-collections')
  const dclenv = qs.get('dclenv')

  if (realm) {
    data.realm = realm
  }

  if (position) {
    data.position = position
  }

  if (selfPreviewBuilderCollections) {
    data['self-preview-builder-collections'] = selfPreviewBuilderCollections
  }

  if (dclenv) {
    data.dclenv = dclenv
  }

  return data
}
