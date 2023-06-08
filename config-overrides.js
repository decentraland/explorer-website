const { override, babelInclude } = require('customize-cra')
const path = require('path')

let overrideArgs = []

if (process.env.NODE_ENV === 'development') {
  overrideArgs = [
    babelInclude([
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/@walletconnect'),
      path.resolve(__dirname, 'node_modules/@walletconnect'),
      path.resolve(__dirname, 'node_modules/@web3modal')
    ])
  ]
}

module.exports = override(overrideArgs)
