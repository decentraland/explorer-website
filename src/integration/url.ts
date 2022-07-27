const qs = new URLSearchParams(document.location.search || '')
export const DEBUG_ANALYTICS = qs.has('DEBUG_ANALYTICS')
export const ENV = qs.get('ENV')
export const NETWORK = qs.get('NETWORK')
export const RENDERER_TYPE = qs.get('ws') ? 'native' : 'web'
export const PLATFORM = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown'
export const HOSTNAME = document.location.hostname

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