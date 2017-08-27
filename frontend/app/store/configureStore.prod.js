import thunk from 'redux-thunk'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { flashClearMiddleware } from 'middleware/flash'

import rootReducer from '../reducers'

export default function configureStore(initialState, history) {
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = applyMiddleware(
    thunk,
    reduxRouterMiddleware,
    flashClearMiddleware,
  )

  const createStoreWithMiddleware = compose(middleware)

  return createStoreWithMiddleware(createStore)(rootReducer, initialState)
}
