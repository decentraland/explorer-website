const qs = new URLSearchParams(document.location.search || '')

export const DEBUG_ANALYTICS = qs.has('DEBUG_ANALYTICS')
export const ENV = qs.get('ENV')
export const NETWORK = qs.get('NETWORK')
export const RENDERER_TYPE = qs.get('ws') ? 'native' : 'web'
export const PLATFORM = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown'