const { override, babelInclude } = require('customize-cra')
const path = require('path')

let overrideArgs = []

if (process.env.NODE_ENV === 'development') {
  overrideArgs = [
    // Overwrites the include option for babel loader, for when you need to transpile a module in your node_modules folder.
    babelInclude([
      // Src has to be included or else your own app won't be transpiled.
      path.resolve(__dirname, 'src'),
      // WalletConnectV2 modules that need to be transpiled.
      path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/@walletconnect'),
      path.resolve(__dirname, 'node_modules/@walletconnect'),
      path.resolve(__dirname, 'node_modules/@web3modal')
    ])
  ]
}

module.exports = override(overrideArgs)
