import { WebSocketProvider, RequestManager } from 'eth-connect'
import { localStorageClearIdentity } from '@dcl/single-sign-on-client'
import { ConnectionResponse, Provider, ProviderAdapter, connection } from 'decentraland-connect'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { switchProviderChainId } from 'decentraland-dapps/dist/modules/wallet/utils/switchProviderChainId'
import { defaultWebsiteErrorTracker, track } from '../utils/tracking'

export const SECONDS_IN_MILLIS = 1000
export const CONNECTION_TIMEOUT_IN_MILLIS = 10 * SECONDS_IN_MILLIS

export const chainIdRpc = new Map<number, string>([
  [1, 'wss://rpc.decentraland.org/mainnet'],
  [5, 'wss://rpc.decentraland.org/goerli'],
  [11155111, 'wss://rpc.decentraland.org/sepolia']
])

export async function getEthereumProvider(
  type: ProviderType | null,
  chainId: ChainId
): Promise<{
  provider: Provider
  chainId: number
  account: string | null
}> {
  if (type === null) {
    const rpc = chainIdRpc.get(chainId)
    if (!rpc) throw new Error("Can't get RPC for chainId " + chainId)
    return {
      provider: new ProviderAdapter(new WebSocketProvider(rpc) as any) as any,
      chainId,
      account: null
    }
  }

  const result = await connection.connect(type, chainId)
  return {
    provider: result.provider,
    chainId: result.chainId,
    account: result.account
  }
}

export async function restoreConnection(): Promise<ConnectionResponse | null> {
  return await Promise.race([connection.tryPreviousConnection().catch(() => null), delay(CONNECTION_TIMEOUT_IN_MILLIS)])
}

export async function disconnect(): Promise<void> {
  try {
    try {
      const requestManager = new RequestManager(await connection.getProvider())
      const account = (await requestManager.eth_accounts())[0]
      if (account) {
        localStorageClearIdentity(account)
      }
    } catch (err) {
      // Ignore the error if for some reason the account could not be obtained.
    }

    await connection.disconnect()
    window.location.reload()
  } catch (err) {
    defaultWebsiteErrorTracker(err)
    return
  }
}

export async function switchToChainId(wantedChainId: ChainId, providerChainId: ChainId) {
  try {
    track('switch_chain', {
      wanted_chain_id: wantedChainId,
      provider_chain_id: providerChainId
    })

    const provider = await connection.getProvider()

    await switchProviderChainId(provider, wantedChainId)

    return
  } catch (error: any) {
    defaultWebsiteErrorTracker(error)
    throw new Error(error.message)
  }
}

function delay(millis: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), millis)
  })
}
