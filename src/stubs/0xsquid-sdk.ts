/**
 * Stub for @0xsquid/sdk. Mapped via vite.config.ts resolve.alias.
 * Only AxelarProvider in decentraland-transactions imports this, and the
 * explorer-website never instantiates AxelarProvider — so the class body
 * here is never reached at runtime.
 */

export class Squid {
  initialized = false
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_opts?: unknown) {}
  async init(): Promise<void> {
    /* noop */
  }
}

export const SquidCallType = {} as Record<string, string>
export const ChainType = {} as Record<string, string>
