import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import mime from 'mime-types'
import fs from 'fs'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), basicSsl()],
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  server: {
    https: {},
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    proxy: {
      '/cdn/packages/website': {
        selfHandleResponse: true,
        bypass(req, res) {
          const urlParts = /\/cdn\/packages\/website\/([^\/]+)\/([^?]*).*$/g.exec(req.url || '')
          const filePath = urlParts && urlParts.length > 2 && urlParts[2]
          if (!filePath) {
            return
          }

          const mimeType = mime.lookup(filePath)
          res.setHeader('x-timestamp', Date.now())
          res.setHeader('x-sent', 'true')
          res.setHeader('etag', JSON.stringify(Date.now().toString()))
          res.setHeader('cache-control', 'no-cache,private,max-age=1')
          res.setHeader('Content-Type', mimeType ? mimeType.toString() : 'text/plain')
          fs.createReadStream(`./public/${filePath}`).pipe(res)
        }
      },
      '/cdn/packages/explorer': {
        selfHandleResponse: true,
        bypass(req, res) {
          const urlParts = /\/cdn\/packages\/explorer\/([^\/]+)\/([^?]*).*$/g.exec(req.url || '')
          const filePath = urlParts && urlParts.length > 2 && urlParts[2]
          if (!filePath) {
            return
          }
          const mimeType = mime.lookup(filePath)
          res.setHeader('x-timestamp', Date.now())
          res.setHeader('x-sent', 'true')
          res.setHeader('etag', JSON.stringify(Date.now().toString()))
          res.setHeader('cache-control', 'no-cache,private,max-age=1')
          res.setHeader('Content-Type', mimeType ? mimeType.toString() : 'text/plain')
          fs.createReadStream(`./node_modules/@dcl/explorer/${filePath}`).pipe(res)
        }
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '/auth': {
        target: 'https://decentraland.zone',
        followRedirects: true,
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
