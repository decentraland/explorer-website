const qs = new URLSearchParams(location.search || '')

export const DEBUG_ANALYTICS = qs.has('DEBUG_ANALYTICS')