/**
 * Stub for @0xsquid/sdk. Mapped via vite.config.ts resolve.alias.
 * Only AxelarProvider in decentraland-transactions imports this, and the
 * explorer-website never instantiates AxelarProvider. Throwing in the
 * constructor surfaces an obvious error if that assumption ever breaks.
 */

export class Squid {
  initialized = false
  constructor() {
    throw new Error(
      '@0xsquid/sdk is stubbed in explorer-website. Cross-chain (AxelarProvider) is not supported here. ' +
        'Remove the vite.config.ts resolve.alias if cross-chain becomes a real requirement.'
    )
  }
  async init(): Promise<void> {
    /* unreachable — constructor throws first */
  }
}

export const SquidCallType = {} as Record<string, string>
export const ChainType = {} as Record<string, string>
