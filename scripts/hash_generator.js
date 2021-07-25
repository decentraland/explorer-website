const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const childProcess = require('child_process')

let ENV_CONTENT = {}

if (fs.existsSync('.env')) {
  Object.assign(ENV_CONTENT, dotenv.parse(fs.readFileSync('.env')))
}

const commitVersion = childProcess.execSync('git rev-parse HEAD').toString().trim()

const kernelVersion = JSON.parse(fs.readFileSync(require.resolve('decentraland-kernel/package.json'))).version
const rendererVersion = JSON.parse(fs.readFileSync(require.resolve('@dcl/unity-renderer/package.json'))).version

ENV_CONTENT['KERNEL_PATH'] = path.dirname(require.resolve('decentraland-kernel/package.json'))
ENV_CONTENT['REACT_APP_WEBSITE_VERSION'] = commitVersion
ENV_CONTENT['REACT_APP_RENDERER_VERSION'] = rendererVersion
ENV_CONTENT['REACT_APP_KERNEL_VERSION'] = kernelVersion

console.log('VERSIONS:', Object.entries(ENV_CONTENT), '\n')

fs.writeFileSync(
  '.env',
  Object.entries(ENV_CONTENT)
    .map((e) => e[0] + '=' + JSON.stringify(e[1]))
    .join('\n') + '\n'
)
