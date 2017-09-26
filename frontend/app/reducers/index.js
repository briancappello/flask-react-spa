import { combineReducers } from 'redux'
import formReducer from 'redux-form/es/reducer'
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
