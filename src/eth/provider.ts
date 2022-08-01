import { connection, ConnectionResponse } from 'decentraland-connect'
import { WebSocketProvider } from 'eth-connect'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { IEthereumProvider } from '@dcl/kernel-interface'
import { defaultWebsiteErrorTracker } from '../utils/tracking'

export const chainIdRpc = new Map<number, string>([
  [1, 'wss://rpc.decentraland.org/mainnet'],
  [3, 'wss://rpc.decentraland.org/ropsten']
])

export async function getEthereumProvider(
  type: ProviderType | null,
  chainId: ChainId
): Promise<{
  provider: IEthereumProvider
  chainId: number
  account: string | null
}> {
  if (type === null) {
    const rpc = chainIdRpc.get(chainId)
    if (!rpc) throw new Error("Can't get RPC for chainId " + chainId)
    return {
      provider: new WebSocketProvider(rpc),
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
