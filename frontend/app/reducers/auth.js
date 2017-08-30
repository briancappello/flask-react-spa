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

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case login.REQUEST:
      return {
        ...initialState,
        isAuthenticating: true,
      }

    case login.SUCCESS:
      const { token, user } = payload
      storage.doLogin(token, user)
      return {
        ...initialState,
        isAuthenticated: true,
        token,
        username: user.username,
        email: user.email,
      }

    case login.FAILURE:
      const { response: { status, error } } = payload
      storage.doLogout()
      return {
        ...initialState,
        statusText: `Authentication Error (${status}): ${error}`,
      }

    case login.FULFILL:
      return { ...state,
        isAuthenticating: false,
      }

    case logout.REQUEST:
      return {
        ...initialState,
        isAuthenticating: true,
      }

    case logout.SUCCESS:
    case logout.FULFILL:
      storage.doLogout()
      return initialState
  }
  return state
}

export const selectAuth = (state) => state.auth
