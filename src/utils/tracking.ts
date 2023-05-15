import { TrackingEvents } from '../trackingEvents'
import { AnalyticsOptions, internalTrackEvent, trackError } from '../integration/analytics'
import { errorToString } from './errorToString'
import { callOnce } from './callOnce'
import { isRecommendedBrowser } from '../integration/browser'
import { PLATFORM, RENDERER_TYPE } from '../integration/url'
import { KernelSeverityLevel } from '@dcl/kernel-interface'

// declare var ethereum: Record<string, boolean>
const ethereum = (window as any).ethereum
const rollouts = (window as any).ROLLOUTS

const overriddenEventOptions: Partial<Record<keyof TrackingEvents, AnalyticsOptions>> = {
  click_login_button: {
    integrations: {
      'All': true,
      'Google AdWords New': true
    }
  }
}

const getWalletName = callOnce(() => {
  if (!ethereum) {
    return 'none'
  } else if (ethereum?.isMetaMask) {
    return 'metamask'
  } else if (ethereum?.isDapper) {
    return 'dapper'
  } else if (ethereum?.isCucumber) {
    return 'cucumber'
  } else if (ethereum?.isTrust) {
    return 'trust'
  } else if (ethereum?.isToshi) {
    return 'coinbase'
  } else if (ethereum?.isGoWallet) {
    return 'goWallet'
  } else if (ethereum?.isAlphaWallet) {
    return 'alphaWallet'
  } else if (ethereum?.isStatus) {
    return 'status'
  } else {
    return 'other'
  }
})

const getWalletProps = callOnce(() => {
  if (!ethereum) {
    return ''
  }

  return Object.keys(ethereum)
    .filter((prop) => prop.startsWith('is') && typeof ethereum![prop] === 'boolean')
    .join(',')
})

const getEnvironmentProperties = callOnce(() => {
  const properties: Record<string, string> = {
    rendererType: RENDERER_TYPE,
    kernelPlatform: PLATFORM
  }

  if (rollouts) {
    for (const rollout of Object.keys(rollouts)) {
      const lib = rollouts[rollout]
      if (lib && lib.prefix && lib.version) {
        properties[lib.prefix || rollout] = lib.version
      }
    }
  }

  return properties
})

export const getRepositoryName = callOnce(() => {
  return rollouts?._site?.prefix as string | undefined
})

export const getRepositoryVersion = callOnce(() => {
  return rollouts?._site?.version as string | undefined
})

/**
 * The only function used by this react app to track its own events.
 * Please do not use internalTrackEvent directly, it is meant to be used by kernel
 * and this function adds relevant information and proper types.
 */
export function track<E extends keyof TrackingEvents>(event: E, properties?: TrackingEvents[E]) {
  const wallet = getWalletName()
  const walletProps = getWalletProps()
  const recommendedBrowser = isRecommendedBrowser()
  const environmentProperties = getEnvironmentProperties()
  internalTrackEvent(
    event,
    { wallet, walletProps, recommendedBrowser, ...properties, ...environmentProperties },
    overriddenEventOptions[event]
  )
}

export function errorTraker(error: any, properties: Record<string, any> = {}, level: KernelSeverityLevel = 'critical') {
  console.error(error)
  const wallet = getWalletName()
  const walletProps = getWalletProps()
  const recommendedBrowser = isRecommendedBrowser()
  const environmentProperties = getEnvironmentProperties()
  trackError(error, { wallet, walletProps, recommendedBrowser, ...properties, ...environmentProperties }, level)
}


/**
 * Default "catch" for promises and to print errors in the console.
 */
export function defaultKernelErrorTracker(error: any, properties: Record<string, any> = {}, level: KernelSeverityLevel = 'critical') {
  errorTraker(error, { ...properties, context: 'kernel' }, level)
  track('explorer_kernel_error', {
    // this string concatenation exists on purpose, it is a safe way to do (error).toString in case (error) is nullish
    error: errorToString(error)
  })
}

/**
 * Default "catch" for promises and to print errors in the console.
 */
export function defaultWebsiteErrorTracker(error: any, properties: Record<string, any> = {}) {
  errorTraker(error, { ...properties, context: 'explorer-website' })
  track('explorer_website_error', {
    // this string concatenation exists on purpose, it is a safe way to do (error).toString in case (error) is nullish
    error: errorToString(error)
  })
}
