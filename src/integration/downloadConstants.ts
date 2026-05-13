/**
 * Centralized download URLs.
 * Mirrors decentraland-ui2/modules/downloadUrls but avoids deep imports
 * that break with module federation's shared scope.
 */
const DOWNLOAD_URLS = {
  windows: 'https://decentraland.org/download',
  apple: 'https://decentraland.org/download',
  epic: 'https://store.epicgames.com/en-US/p/decentraland-b692fb',
  googlePlay:
    'https://play.google.com/store/apps/details?id=org.decentraland.godotexplorer&utm_org=dclrgl&utm_source=fdn&utm_medium=qr&utm_campaign=dclpage&utm_content=android',
  appStore: 'https://apps.apple.com/app/apple-store/id6478403840?pt=126284288&ct=Decentraland%20Home%20iOS&mt=8'
} as const

type DownloadOS = 'apple' | 'windows' | 'android' | 'ios'

function detectDownloadOS(): DownloadOS {
  if (typeof navigator === 'undefined') return 'windows'
  const ua = navigator.userAgent.toLowerCase()
  if (/android/.test(ua)) return 'android'
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/mac/.test(ua)) return 'apple'
  return 'windows'
}

function getDownloadUrl(os: DownloadOS): string {
  switch (os) {
    case 'apple':
      return DOWNLOAD_URLS.apple
    case 'ios':
      return DOWNLOAD_URLS.appStore
    case 'android':
      return DOWNLOAD_URLS.googlePlay
    default:
      return DOWNLOAD_URLS.windows
  }
}

export { DOWNLOAD_URLS, detectDownloadOS, getDownloadUrl }
export type { DownloadOS }
