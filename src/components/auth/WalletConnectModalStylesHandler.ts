/**
 * This singleton class has the only purpose of updating the styles of the wallet connect modal depending if the connection
 * is requested via the WalletConnect button or the MetaMask button.
 */
export class WalletConnectModalStylesHandler {
  private static _instance?: WalletConnectModalStylesHandler

  static instance = (): WalletConnectModalStylesHandler => {
    if (!WalletConnectModalStylesHandler._instance) {
      WalletConnectModalStylesHandler._instance = new WalletConnectModalStylesHandler()
    }

    return WalletConnectModalStylesHandler._instance
  }

  private initializationPromise?: Promise<void>

  private originalStyles?: {
    '--wcm-accent-color': string
    '--wcm-accent-fill-color': string
    '--wcm-background-color': string
  }

  private constructor() {}

  /**
   * Call this method at the same time the Wallet Connect connection has been requested.
   * If the Wallet Connect connection has already initialized or has never been requested, this method will never resolve.
   */
  changeToMetaMaskStyle = async () => {
    await this.waitForInitialization()

    const html = document.documentElement

    html.style.setProperty('--wcm-accent-color', '#f6851b')
    html.style.setProperty('--wcm-accent-fill-color', '#f6851b')
    html.style.setProperty('--wcm-background-color', '#f6851b')
  }

  /**
   * Call this method at the same time the Wallet Connect connection has been requested.
   * If the Wallet Connect connection has already initialized or has never been requested, this method will never resolve.
   */
  changeToOriginalStyle = async () => {
    await this.waitForInitialization()

    const html = document.documentElement

    html.style.setProperty('--wcm-accent-color', this.originalStyles!['--wcm-accent-color'])
    html.style.setProperty('--wcm-accent-fill-color', this.originalStyles!['--wcm-accent-fill-color'])
    html.style.setProperty('--wcm-background-color', this.originalStyles!['--wcm-background-color'])
  }

  private waitForInitialization = (): Promise<void> => {
    if (this.originalStyles) {
      return Promise.resolve()
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = new Promise<void>((resolve) => {
      const html = document.documentElement

      const observer = new MutationObserver(() => {
        observer.disconnect()

        this.originalStyles = {
          '--wcm-accent-color': html.style.getPropertyValue('--wcm-accent-color'),
          '--wcm-accent-fill-color': html.style.getPropertyValue('--wcm-accent-fill-color'),
          '--wcm-background-color': html.style.getPropertyValue('--wcm-background-color')
        }

        resolve()
      })

      observer.observe(html, { attributeFilter: ['style'] })
    })

    return this.initializationPromise
  }
}
