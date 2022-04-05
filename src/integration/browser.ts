import { detect } from "detect-browser"
import { setBanner } from "../state/actions"
import { BannerType, store } from "../state/redux"
import { callOnce } from "../utils/callOnce"

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
      return true

    default:
      return false
  }
})

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

export type UserPosition = Partial<{
  realm: string,
  position: string,
}>

export function getCurrentPosition() {
  const data: UserPosition = {}
  const qs = new URLSearchParams(globalThis.location.search || '')

  // inject realm
  if (qs.has('realm')) {
    data.realm = qs.get('realm')!
  }

  // inject position
  if (qs.has('position')) {
    data.position = qs.get('position')!
  }

  return data
}
