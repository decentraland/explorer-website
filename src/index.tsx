import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { DclThemeProvider, darkTheme } from 'decentraland-ui2'

import { configureSegment, configureSentry } from './integration/analytics'
import { store } from './state/redux'
import { configureKernel } from './integration/kernel'
import { initializeBrowserRecommendation } from './integration/browser'
import { initializeFeatureFlags } from './integration/featureFlags'
import { GlobalStyles } from './components/GlobalStyles'
import { LocaleProvider } from './intl/LocaleContext'
import App from './components/App'

configureSegment()
configureSentry()
configureKernel(store)

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DclThemeProvider theme={darkTheme}>
        <LocaleProvider>
          <GlobalStyles />
          <App />
        </LocaleProvider>
      </DclThemeProvider>
    </Provider>
  </React.StrictMode>
)
initializeBrowserRecommendation()
initializeFeatureFlags()
