import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import Helmet from 'react-helmet'

import { NavBar, ProgressBar } from 'components'
import { SITE_NAME, COPYRIGHT } from 'config'
import Routes from 'routes'


const AppLayout = () => (
  <div className="fixed-nav-top">
    <Helmet titleTemplate={`%s - ${SITE_NAME}`}
            defaultTitle={SITE_NAME}
    />
    <ProgressBar />
    <header>
      <NavBar />
    </header>
    <main>
      <Routes />
    </main>
    <footer className="center">
       Copyright {new Date().getFullYear()} {COPYRIGHT}
    </footer>
  </div>
)

export default (props) => (
  <Provider store={props.store}>
    <ConnectedRouter history={props.history}>
      <AppLayout />
    </ConnectedRouter>
  </Provider>
)
