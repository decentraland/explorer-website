import future from 'fp-future'
import { KernelOptions, KernelResult, IDecentralandKernel } from '@dcl/kernel-interface'

export async function injectKernel(options: KernelOptions): Promise<KernelResult> {
  const kernelUrl = new URL(`index.js`, options.kernelOptions.baseUrl).toString()

  await injectScript(kernelUrl)

  console.log('Kernel: ', kernelUrl)

  const DecentralandKernel: IDecentralandKernel = (globalThis as any).DecentralandKernel

  if (!DecentralandKernel) throw new Error('DecentralandKernel could not be loaded')

  return await DecentralandKernel.initKernel(options)
}

async function injectScript(url: string) {
  const theFuture = future<Event>()
  const theScript = document.createElement('script')
  theScript.src = url
  theScript.async = true
  theScript.type = 'application/javascript'
  theScript.addEventListener('load', theFuture.resolve)
  theScript.addEventListener('error', (e) => theFuture.reject(e.error || new Error(`The script ${url} failed to load`)))
  document.body.appendChild(theScript)
  return theFuture
}
