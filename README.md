# Decentraland explorer-website

This repository holds the application shell that launches the web version of Decentraland Explorer.

The responsibility of this repository is to generate the React UI to configure the ethereum providers, handle analytics and ultimately load and start the [Explorer](https://github.com/decentraland/unity-renderer).

Keep in mind that the interaction with the Wallet the user's using is partly being handled by the [explorer](https://github.com/decentraland/unity-renderer) and it's dependencies (like [eth-connect](https://github.com/decentraland/eth-connect)). This repository is reponsible for creating a provider using [decentraland-connect](https://github.com/decentraland/decentraland-connect) and handing that down to the Explorer.

## Consistent versions

To enable consistent versioning, this repository embeds `decentraland-ecs` which is used locally by the scene, wearables and other content developers to create and debug Decentraland scenes.

To get a working Decentraland Explorer that is fully compliant with a specific version of the SDK (`decentraland-ecs`) please do install stable versions of the library via `npm install decentraland-ecs@latest`.

## How to test

```bash
npm ci
npm run start
```

You must test that the application works both in http://localhost:3000 and in http://localhost:3000/cdn/packages/website/index.html since it provides a CDN-like environment.

## How to test with local Explorer

The website has the [explorer](https://github.com/decentraland/unity-renderer) as a dependency. To be able to run the site locally, you have a few options:

1. Edit `.env.development` to point the `EXPLORER_PATH` env var to your local explorer folder
2. Run `npm run postinstall` to update the .env files
3. Run `npm run start:linked`

If the linking is not working you can try one of two things:

1. Check the path the build is trying to use to find the Explorer by reading the error page. It might look something like `../unity-renderer/browser-interface/static/index.js`
2. Create the directory structure needed, in this case `mkdir ../unity-renderer/browser-interface/static`
3. Get the index.js from the BrowserInterface dependency installed on node_modules: `cp ./node_modules/@dcl/explorer/index.js ../unity-renderer/browser-interface/static`

Another choice is to:

1. Clone the [explorer](https://github.com/decentraland/unity-renderer) project
2. Make sure the folder is located where the linking error is trying to find it, usually `../unity-renderer/browser-interface`
3. Build it locally (check the [Explorer README](https://github.com/decentraland/unity-renderer#running-the-explorer))
