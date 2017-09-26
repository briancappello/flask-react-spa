import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

import authReducer from './auth'
import flashReducer from './flash'


export default function createReducer(injectedReducers) {
  return combineReducers({
    auth: authReducer,
    flash: flashReducer,

    form: formReducer,
    routing: routerReducer,
    loadingBar: loadingBarReducer,

    ...injectedReducers,
  })
}
