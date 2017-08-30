import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import authReducer from './auth'
import flashReducer from './flash'
import protectedReducer from './protected'

const rootReducer = combineReducers({
  auth: authReducer,
  flash: flashReducer,
  protected: protectedReducer,

  routing: routerReducer,
})

export default rootReducer
