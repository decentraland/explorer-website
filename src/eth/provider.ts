import { connection, ProviderType, ConnectionResponse } from 'decentraland-connect'
import { WebSocketProvider } from 'eth-connect'
import { ChainId } from '@dcl/schemas'
import { IEthereumProvider } from '@dcl/kernel-interface'

export const chainIdRpc = new Map<number, string>([
  [1, 'wss://mainnet.infura.io/ws/v3/074a68d50a7c4e6cb46aec204a50cbf0'],
  [3, 'wss://ropsten.infura.io/ws/v3/074a68d50a7c4e6cb46aec204a50cbf0']
])

export async function getEthereumProvider(type: ProviderType | null, chainId: ChainId): Promise<IEthereumProvider> {
  if (type === null) {
    const rpc = chainIdRpc.get(chainId)
    if (!rpc) throw new Error("Can't get RPC for chainId " + chainId)
    return new WebSocketProvider(rpc)
  }

  const result = await connection.connect(type, chainId)

  return result.provider
}

export async function restoreConnection(): Promise<ConnectionResponse | null> {
  try {
    return await connection.tryPreviousConnection()
  } catch (err) {
    return null
  }
}
