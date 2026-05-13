import { defineConfig, loadEnv, type Plugin } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import react from '@vitejs/plugin-react-swc'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import mime from 'mime-types'
import fs from 'fs'
import path from 'path'

// Cross-chain Axelar bridge SDK imported by decentraland-transactions/AxelarProvider.
// AxelarProvider is never instantiated by explorer-website, so we alias the SDK
// to a tiny stub to keep ~hundreds of KB out of the bundle.
const SQUID_STUB = path.resolve(process.cwd(), 'src/stubs/0xsquid-sdk.ts')

// Serves `/cdn/packages/<group>/<version>/<filePath>` from a local directory in dev.
// Replaces the Vite-5 `server.proxy` bypass hack, which Vite 7 no longer accepts
// (proxy entries now require a `target` and reject bypass-only configs).
function cdnPackagesPlugin(): Plugin {
  const handlers: { prefix: string; rootDir: string }[] = [
    { prefix: '/cdn/packages/website/', rootDir: './public' },
    { prefix: '/cdn/packages/explorer/', rootDir: './node_modules/@dcl/explorer' }
  ]
  const matcher = /^\/cdn\/packages\/(website|explorer)\/[^/]+\/([^?]*).*$/

  return {
    name: 'cdn-packages-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        const handler = handlers.find((h) => url.startsWith(h.prefix))
        if (!handler) return next()

        const match = matcher.exec(url)
        const filePath = match && match[2]
        if (!filePath) return next()

        // Containment check: resolve and reject anything that escapes the root.
        const rootAbs = path.resolve(handler.rootDir)
        const fullPath = path.resolve(rootAbs, filePath)
        if (!fullPath.startsWith(rootAbs + path.sep) && fullPath !== rootAbs) {
          res.statusCode = 403
          res.end()
          return
        }
        fs.stat(fullPath, (err, stat) => {
          if (err || !stat.isFile()) return next()
          const mimeType = mime.lookup(filePath)
          res.setHeader('Content-Type', mimeType ? mimeType.toString() : 'application/octet-stream')
          res.setHeader('Cache-Control', 'no-cache,private,max-age=1')
          fs.createReadStream(fullPath).pipe(res)
        })
      })
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    // depending on your application, base can also be "/"
    base: '',
    plugins: [react(), cdnPackagesPlugin()],
    resolve: {
      alias: [
        { find: /^@0xsquid\/sdk(\/dist\/types)?$/, replacement: SQUID_STUB },
        { find: /^@0xsquid\/squid-types$/, replacement: SQUID_STUB }
      ]
    },
    define: {
      'process.env': {},
      global: 'globalThis'
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 5173
      port: 5173,
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/auth': {
          target: 'https://decentraland.zone',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    ...(command === 'build'
      ? {
          base: envVariables.VITE_PUBLIC_URL,
          optimizeDeps: {
            esbuildOptions: {
              // Node.js global to browser globalThis
              define: {
                global: 'globalThis'
              },
              // Enable esbuild polyfill plugins
              plugins: [
                NodeGlobalsPolyfillPlugin({
                  buffer: true,
                  process: true
                }),
                NodeModulesPolyfillPlugin()
              ]
            }
          },
          build: {
            commonjsOptions: {
              transformMixedEsModules: true
            },
            rollupOptions: {
              plugins: [rollupNodePolyFill()]
            },
            // Sourcemaps were doubling the publish tarball (one .map per chunk) and the wallet
            // stack added thousands of chunks — the GitHub Actions runner was killed mid-`npm
            // publish` while emitting the per-file `npm notice` listing. Disabling regenerates a
            // smaller, publishable dist. Re-enable as 'hidden' if Sentry source-map upload is
            // wired up later (would need a separate strip-from-publish step).
            sourcemap: false
          }
        }
      : undefined)
  } as any
})
