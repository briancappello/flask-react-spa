import createReducer from './createReducer'

import { logout } from 'actions/auth'
import { fetchProtected } from 'actions/protected'


export const initialState = {
  isLoaded: false,
  isLoading: false,
  data: null,
  error: null,
}

export default createReducer(initialState, {
  [fetchProtected.REQUEST]: () => {
    return { ...initialState, isLoading: true }
  },
  [fetchProtected.SUCCESS]: (state, payload) => {
    return { ...initialState, isLoaded: true, data: payload }
  },
  [fetchProtected.FAILURE]: (state, payload) => {
    return { ...initialState, error: payload }
  },
  [logout.SUCCESS]: () => initialState,
  [logout.FULFILL]: () => initialState,
})

export const selectProtected = (state) => state.protected
