const fs = require('fs')
const dotenv = require('dotenv')
const { cdnFolder } = require('./utils')

let ENV_CONTENT = {}

if (fs.existsSync('.env')) {
  Object.assign(ENV_CONTENT, dotenv.parse(fs.readFileSync('.env')))
}

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString())
const publicPackageJson = JSON.parse(fs.readFileSync('./public/package.json').toString())

const explorerVersion = JSON.parse(fs.readFileSync(require.resolve('@dcl/explorer/package.json'))).version

ENV_CONTENT['REACT_APP_WEBSITE_VERSION'] = packageJson.version
ENV_CONTENT['REACT_APP_EXPLORER_VERSION'] = explorerVersion

Object.assign(ENV_CONTENT, getPublicUrls())

packageJson.homepage = ENV_CONTENT['PUBLIC_URL']

if (packageJson.homepage) {
  // github action outputs. Do not touch.
  console.log('::set-output name=public_url::' + packageJson.homepage)
  console.log('::set-output name=public_path::' + new URL(packageJson.homepage).pathname)
}

console.log('VERSIONS: ', Object.entries(ENV_CONTENT), '\n')

fs.writeFileSync(
  '.env',
  Object.entries(ENV_CONTENT)
    .map((e) => e[0] + '=' + JSON.stringify(e[1]))
    .join('\n') + '\n'
)

publicPackageJson.homepage = packageJson.homepage
publicPackageJson.version = packageJson.version

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
fs.writeFileSync('./public/package.json', JSON.stringify(publicPackageJson, null, 2))

function getPublicUrls() {
  if (!process.env.GEN_STATIC_LOCAL) {
    if (process.env.GITHUB_BASE_REF) {
      // Pull request
      return {
        PUBLIC_URL: `https://explorer-artifacts.decentraland.org/${packageJson.name}/branch/${process.env.GITHUB_HEAD_REF}`,
        REACT_APP_EXPLORER_BASE_URL: ``,
      }
    } else if (process.env.CI) {
      // master/main branch, also releases
      return {
        PUBLIC_URL: `https://cdn.decentraland.org/${packageJson.name}/${packageJson.version}`,
        REACT_APP_EXPLORER_BASE_URL: ``,
      }
    }
  }
  // localhost
  return {
    PUBLIC_URL: ``,
    REACT_APP_EXPLORER_BASE_URL: cdnFolder('@dcl/explorer', explorerVersion) + `/`,
  }
}
