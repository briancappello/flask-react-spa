import createReducer from './createReducer'
import { login, logout } from 'actions/auth'

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
    localStorage.setItem('token', token)
    return {
      ...initialState,
      isAuthenticated: true,
      token: token,
      username: user.username,
      email: user.email,
    }
  },
  [login.FAILURE]: (state, { response: { status, error } }) => {
    localStorage.removeItem('token')
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
    localStorage.removeItem('token')
    return initialState
  },
})

export const selectAuth = (state) => state.auth
