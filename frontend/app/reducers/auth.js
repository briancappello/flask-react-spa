import createReducer from './createReducer'
import { login, logout } from 'actions/auth'
import storage from 'utils/storage'

export const initialState = {
  token: null,
  username: null,
  email: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
}

export default createReducer(initialState, {
  [login.REQUEST]: () => {
    return {
      ...initialState,
      isAuthenticating: true,
    }
  },
  [login.SUCCESS]: (state, { token, user }) => {
    storage.doLogin(token, user)
    return {
      ...initialState,
      isAuthenticated: true,
      token: token,
      username: user.username,
      email: user.email,
    }
  },
  [login.FAILURE]: (state, { response: { status, error } }) => {
    storage.doLogout()
    return {
      ...initialState,
      statusText: `Authentication Error (${status}): ${error}`,
    }
  },
  [logout.REQUEST]: () => {
    return {
      ...initialState,
      isAuthenticating: true,
    }
  },
  [logout.FULFILL]: () => {
    storage.doLogout()
    return initialState
  },
})

export const selectAuth = (state) => state.auth
