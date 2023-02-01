import type { ConnectionResponse, Provider } from 'decentraland-connect/dist/types'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { ProviderAdapter } from 'decentraland-connect/dist/ProviderAdapter'
import { WebSocketProvider } from 'eth-connect/providers/WebSocketProvider'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { switchProviderChainId } from 'decentraland-dapps/dist/modules/wallet/utils/switchProviderChainId'
import { defaultWebsiteErrorTracker, track } from '../utils/tracking'

export const chainIdRpc = new Map<number, string>([
  [1, 'wss://rpc.decentraland.org/mainnet'],
  [5, 'wss://rpc.decentraland.org/goerli']
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
  try {
    return await Promise.race<ConnectionResponse | null>([
      connection.tryPreviousConnection(),
      new Promise((_, reject) => setTimeout(() => reject('Connection timeout'), 10 * 1000)) as any
    ])
  } catch (err) {
    return null
  }
}

export async function disconnect(): Promise<void> {
  try {
    return await connection.disconnect()
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
    window.location.reload()
    return
  } catch (error: any) {
    defaultWebsiteErrorTracker(error)
    throw new Error(error.message)
  }
}