import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

import authReducer from './auth'
import flashReducer from './flash'
import protectedReducer from './protected'


const rootReducer = combineReducers({
  auth: authReducer,
  flash: flashReducer,
  protected: protectedReducer,

  form: formReducer,
  routing: routerReducer,
})

export default rootReducer
