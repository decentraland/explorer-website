import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import { configureSegment } from './integration/analytics'
import { startKernel } from './kernel-loader'
import { store } from './state/redux'

let INITIAL_RENDER = true

configureSegment()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    if (INITIAL_RENDER) {
      INITIAL_RENDER = false
      startKernel()
      const initial = document.getElementById('root-loading')
      if (initial) {
        initial.style.opacity = '0'
        setTimeout(() => {
          initial.remove()
        }, 300)
      }
    }
  }
)
