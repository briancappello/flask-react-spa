import 'babel-polyfill'

import { AppContainer as HotReloadContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import configureStore from 'configureStore'
import App from 'components/App'

import { login } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import AuthApi from 'api/auth'
import { storage } from 'utils'


const APP_MOUNT_POINT = document.getElementById('app')

const initialState = {}
const history = createHistory()
const store = configureStore(initialState, history)

const renderRootComponent = (Component) => {
  ReactDOM.render(
    <HotReloadContainer>
      <Component store={store} history={history} />
    </HotReloadContainer>,
    APP_MOUNT_POINT
  )
}

const token = storage.getToken()
store.dispatch(login.request())
AuthApi.checkAuthToken(token)
  .then(({ user }) => {
    store.dispatch(login.success({ token, user }))
  })
  .catch(() => {
    store.dispatch(login.failure())
  })
  .then(() => {
    store.dispatch(login.fulfill())
    renderRootComponent(App)
    const isAuthenticated = store.getState().auth.isAuthenticated
    const alreadyHasFlash = store.getState().flash.visible
    if (isAuthenticated && !alreadyHasFlash) {
      store.dispatch(flashInfo('Welcome back!'))
    }
  })

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.unmountComponentAtNode(APP_MOUNT_POINT)
    const NextApp = require('./components/App').default
    renderRootComponent(NextApp)
  })
}
