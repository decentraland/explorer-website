import { getEthereumProvider, restoreConnection } from '../eth/provider'
import { trackEvent, identifyUser, disableAnalytics } from '../integration/analytics'
import { injectKernel } from './injector'
import {
  setKernelAccountState,
  setKernelError,
  setRendererLoading,
  setKernelLoaded,
  setRendererVisible
} from '../state/actions'
import { store } from '../state/redux'
import { ProviderType } from 'decentraland-connect'

export async function authenticate(providerType: ProviderType | null) {
  const provider = await getEthereumProvider(providerType, 1)

  const kernel = store.getState().kernel.kernel

  if (!kernel) throw new Error('Kernel did not load yet')

  kernel.authenticate(provider, providerType == null)
}

declare var KERNEL_BASE_URL: string
declare var RENDERER_BASE_URL: string

async function initKernel() {
  const container = document.getElementById('gameContainer') as HTMLDivElement

  const kernel = await injectKernel({
    kernelOptions: {
      baseUrl: new URL(`${KERNEL_BASE_URL}`, global.location.toString()).toString()
    },
    rendererOptions: {
      container,
      baseUrl: new URL(`${RENDERER_BASE_URL}`, global.location.toString()).toString()
    }
  })

  kernel.trackingEventObservable.add(({ eventName, eventData }) => {
    trackEvent(eventName, eventData)
  })

  kernel.openUrlObservable.add(({ url }) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow != null) newWindow.opener = null
  })

  kernel.accountStateObservable.add((account) => {
    if (account.identity) {
      identifyUser(account.identity.address)
    }
    store.dispatch(setKernelAccountState(account))
  })

  kernel.signUpObservable.add(({ email }) => {
    identifyUser(email)
  })

  kernel.errorObservable.add((error) => {
    store.dispatch(setKernelError(error))
    if (error.level === 'fatal') {
      disableAnalytics()
    }
  })

  kernel.rendererVisibleObservable.add((event) => {
    console.log('visible', event)
    store.dispatch(setRendererVisible(event.visible))
  })

  kernel.loadingProgressObservable.add((event) => {
    store.dispatch(setRendererLoading(event))
  })

  return kernel
}

async function initLogin() {
  const provider = await restoreConnection()

  if (provider) {
    console.log('got previous provider', provider)
  }
}

export function startKernel() {
  initKernel()
    .then((kernel) => {
      store.dispatch(setKernelLoaded(kernel))

      return initLogin()
    })
    .catch((error) => {
      store.dispatch(setKernelError({ error }))
      console.error(error)
    })
}
