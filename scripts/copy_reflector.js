// this file creates the /public/reflector folder containing the reflector

const path = require('path')
const fs = require('fs')

function copyReflector(packageName, folder) {
  const packageJsonPath = require.resolve(packageName + '/package.json')
  const packageFolder = path.dirname(packageJsonPath) + '/dist'
	const destFolder = path.resolve(__dirname, '../' + folder)

  const { name, version } = JSON.parse(fs.readFileSync(packageJsonPath).toString())
	console.log({ name, version })

  console.log(`Copying package ${name}:\n  from: ${packageFolder}\n    to: ${destFolder}`)

	fs.mkdir(destFolder, { recursive: true}, (err) => {
		if (err) {
			console.log('fs.mkdir(): Error: ', err)
			process.exit(1)
		}
	})

	const fn= '/reflector-bc-ws-client.js';

	fs.copyFile(packageFolder+fn, destFolder+fn, (err) => {
		if (err) {
			console.log('fs.copyFile(): Error: ', err)
			process.exit(1)
		}
		else {

		}
	});

	console.log('\n')
}

// to use React's webpack, it must be to /public, not a subdir
copyReflector('@ipsme/reflector-ws-client', './public')

console.log('copy-reflector SUCCEED')
