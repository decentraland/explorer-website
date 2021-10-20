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
