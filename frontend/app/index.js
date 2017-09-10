import 'babel-polyfill'

import { AppContainer as HotReloadContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import configureStore from 'configureStore'
import Root from 'components/Root'

import { login, logout } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import Api from 'utils/api'
import storage from 'utils/storage'

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
Api.checkAuthToken(token)
  .then(({ user }) => {
    store.dispatch(login.success({ token, user }))
  })
  .catch(() => {
    store.dispatch(logout.success())
  })
  .then(() => {
    renderRootComponent(Root)
    const isAuthenticated = store.getState().auth.isAuthenticated
    const isFirstVisit = window.location.search.indexOf('welcome') >= 0
    if (isAuthenticated && !isFirstVisit) {
      store.dispatch(flashInfo('Welcome back!'))
    }
  })

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextRoot = require('./components/Root').default
    renderRootComponent(NextRoot)
  })
}
