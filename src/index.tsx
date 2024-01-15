import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import 'semantic-ui-css/components/site.min.css'
import 'semantic-ui-css/components/modal.min.css'
import 'semantic-ui-css/components/menu.min.css'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/button.min.css'
import 'semantic-ui-css/components/container.min.css'
import 'semantic-ui-css/components/header.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'

import { configureSegment, configureSentry } from './integration/analytics'
import { store } from './state/redux'
import { configureKernel } from './integration/kernel'
import { initializeBrowserRecommendation } from './integration/browser'
import { initializeDesktopApp } from './integration/desktop'
import { initializeFeatureFlags } from './integration/featureFlags'
import App from './components/App'

configureSegment()
configureSentry()
configureKernel(store)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')!,
  () => {
    initializeBrowserRecommendation()
    initializeFeatureFlags()
    initializeDesktopApp()
  }
)
