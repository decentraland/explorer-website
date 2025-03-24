const qs = new URLSearchParams(document.location.search || '')
export const DEBUG_ANALYTICS = qs.has('DEBUG_ANALYTICS')
export const SHOW_WALLET_SELECTOR = qs.has('show_wallet')
export const ENV = qs.get('ENV')
export const NETWORK = qs.get('NETWORK')
export const RENDERER_TYPE = detectClientType(qs)
export const CATALYST = addHttpsIfNoProtocolIsSet(qs.get('CATALYST'))
export const PLATFORM = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown'
export const HOSTNAME = document.location.hostname
export const SKIP_SETUP = qs.has('skipSetup')
export const LOGIN_AS_GUEST = qs.get('guest') === 'true'

function addHttpsIfNoProtocolIsSet(domain: string | null) {
  if (!domain) return null

  if (!domain.startsWith('http')) {
    return `https://${domain}`
  }

  return domain
}

function detectClientType(qs: URLSearchParams) {
  if (!qs.has("VR_TYPE")) {
    return qs.get('ws') ? 'native' : 'web'
  }
  
  const vr_type = qs.get("VR_TYPE")
  if (vr_type === 'desktop') return 'vr_desktop'
  if (vr_type === 'android') return 'vr_android'
}

export function withoutCatalyst(url: string = window.location.href) {
  const newURL = new URL(url)
  newURL.searchParams.delete('CATALYST')
  return newURL.toString()
}

export function  withOrigin(url: string | URL, base: string | URL) {
  const finalURL = new URL(url, base)
  const baseURL = new URL(base)
  if (finalURL.toString().startsWith(baseURL.toString())) {
    return finalURL.toString()
  }

  return baseURL.toString()
}

export function ensureOrigin(url: string | URL) {
  switch (HOSTNAME) {
    case 'play.decentraland.org':
      return  withOrigin(url, 'https://cdn.decentraland.org')

    default:
      return url.toString()
  }
}
