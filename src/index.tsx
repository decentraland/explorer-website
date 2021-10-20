import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureRollbar, configureSegment } from './integration/analytics'
import { store } from './state/redux'
import { hideRoot, initializeKernel } from './integration/kernel'
import { initializeBrowserProps, initializeBrowserRecommendation } from './integration/browser'
import App from './components/App'
import { initializeDesktopApp } from './integration/desktop'
import { initializeFeatureFlags } from './integration/featureFlags'

configureSegment()
configureRollbar()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')!,
  () => {
    initializeKernel()
    initializeBrowserProps()
    initializeBrowserRecommendation()
    initializeFeatureFlags()
    initializeDesktopApp()
    store.subscribe(() => hideRoot(store.getState()))
  }
)
