const { override, babelInclude } = require('customize-cra')
const path = require('path')

/**
 * WalletConnectV2 is implemented by importing @walletconnect/ethereum-provider, which is a dependency of decentraland-connect.
 * This library has some code that is not supported by current version of react-scripts used by this project.
 * To be able to use it. We can add the files with unsupported code to the babelInclude list.
 */
const wcEthereumProviderSupport = [
  path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/@walletconnect/ethereum-provider/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/@walletconnect/universal-provider/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/@walletconnect/universal-provider/node_modules/@walletconnect/utils/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/@walletconnect/utils/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/@walletconnect/sign-client/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/@walletconnect/sign-client/node_modules/@walletconnect/utils/dist/index.es.js'),
  path.resolve(__dirname, 'node_modules/@web3modal/core/dist/index.js'),
  path.resolve(__dirname, 'node_modules/@web3modal/ui/dist/index.js'),
  path.resolve(__dirname, 'node_modules/@walletconnect/sign-client/node_modules/@walletconnect/core/dist/index.es.js')
]

module.exports = override(babelInclude([path.resolve(__dirname, 'src'), ...wcEthereumProviderSupport]))
