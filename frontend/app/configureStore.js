import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import { flashClearMiddleware } from 'middleware/flash'

import rootReducer from 'reducers'
import sagas from 'sagas'

const isDev = process.env.NODE_ENV !== 'production'
const isWindowObject = typeof window === 'object'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState, history) {
  let middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    flashClearMiddleware,
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
  ]

  const composeEnhancers =
    isDev && isWindowObject && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(...enhancers)
  )

  sagas.map(sagaMiddleware.run)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
