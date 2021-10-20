import { detect } from "detect-browser"
import { setBanner, setBrowserProps } from "../state/actions"
import { BannerType, BrowserState, store } from "../state/redux"
import { callOnce } from "../utils/callOnce"

export const initializeBrowserProps = callOnce(() => {
  function windowSizing() {
    const props: BrowserState = {
      height: window.innerHeight,
      width: window.innerWidth,
    }

    store.dispatch(setBrowserProps(props))
  }

  windowSizing()
  window.addEventListener('resize', windowSizing)
})

export const initializeBrowserRecommendation = callOnce(() => {
  if (!isRecommendedBrowser()) {
    store.dispatch(setBanner(BannerType.NOT_RECOMMENDED))
  }
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
