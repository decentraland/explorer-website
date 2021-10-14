import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureRollbar, configureSegment } from './integration/analytics'
import { store } from './state/redux'
import { initializeKernel, initializeRender } from './integration/kernel'
import { initializeBrowserRecommendation } from './integration/browser'
import App from './components/App'
import { initializeDesktopApp } from './integration/desktop'

configureSegment()
configureRollbar()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    initializeKernel()
    initializeBrowserRecommendation()
    initializeDesktopApp()
    store.subscribe(() => initializeRender(store))
  }
)
