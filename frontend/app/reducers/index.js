import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

import authReducer from './auth'
import flashReducer from './flash'


const rootReducer = combineReducers({
  auth: authReducer,
  flash: flashReducer,

  form: formReducer,
  routing: routerReducer,
})

export default rootReducer
