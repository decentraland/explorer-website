const qs = new URLSearchParams(document.location.search || '')
export const DEBUG_ANALYTICS = qs.has('DEBUG_ANALYTICS')
export const ENV = qs.get('ENV')
export const NETWORK = qs.get('NETWORK')
export const RENDERER_TYPE = qs.get('ws') ? 'native' : 'web'
export const CATALYST = addHttpsIfNoProtocolIsSet(qs.get('CATALYST'))
export const PLATFORM = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown'
export const HOSTNAME = document.location.hostname

function addHttpsIfNoProtocolIsSet(domain: string | null) {
  if (!domain) return null

  if (!domain.startsWith('http')) {
    return `https://${domain}`
  }

  return domain
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