# Decentraland explorer-website

This repository holds the application shell that launches the web version of Decentraland Explorer.

The responsibility of this repository is to generate the React UI to configure the ethereum providers, handle analytics and ultimately load and start the Kernel and Renderer.

## How to test

`npm run start`

You must test that the application works both in http://localhost:3000 and in http://localhost:3000/cdn/packages/website/index.html since it provides a CDN-like environment.