const path = require('path')

/**
 * This module set ups routes to serve static content directly from NPM modules.
 * It aims to imitate the production environment, but on the local machine, for the preview mode.
 */
module.exports = function (app) {
  createStaticRoutes(app, '/cdn/packages/website/:version/*', `./public`)
  createStaticRoutes(app, '/cdn/packages/explorer/:version/*', `./node_modules/@dcl/explorer`)
  //createStaticRoutes(app, '/cdn/packages/explorer/:version/*', path.resolve(process.env.EXPLORER_PATH))
}

function createStaticRoutes(app, route, localFolder) {
  app.use(route, (req, res, next) => {
    const options = {
      root: localFolder,
      dotfiles: 'deny',
      maxAge: 1,
      cacheControl: false,
      lastModified: true,
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        etag: JSON.stringify(Date.now().toString()),
        'cache-control': 'no-cache,private,max-age=1'
      }
    }

    const fileName = req.params[0]

    res.sendFile(fileName, options, (err) => {
      if (err) {
        next(err)
      } else {
        console.log(`Sending ${localFolder}/${fileName}`)
      }
    })
  })
}
