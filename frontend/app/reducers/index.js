import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import authReducer, { initialState as authState } from './auth'
import flashReducer, { initialState as flashState } from './flash'
import protectedReducer, { initialState as protectedState } from './protected'

export const initialState = {
  auth: authState,
  flash: flashState,
  protected: protectedState,
}

const rootReducer = combineReducers({
  auth: authReducer,
  flash: flashReducer,
  protected: protectedReducer,

  routing: routerReducer,
})

export default rootReducer
