// config-overrides.js

const { override, babelInclude } = require('customize-cra')
const path = require('path')

module.exports = override(babelInclude([path.resolve(__dirname, 'src')]))
