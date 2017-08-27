import createReducer from './createReducer'

import {
  AUTH_LOGIN_USER_REQUEST,
  AUTH_LOGIN_USER_SUCCESS,
  AUTH_LOGIN_USER_FAILURE,
  AUTH_LOGOUT_USER_REQUEST,
  AUTH_LOGOUT_USER_SUCCESS,
  AUTH_LOGOUT_USER_FAILURE,
} from 'actions/auth'

export const initialState = {
  token: null,
  username: null,
  email: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
}

export default createReducer(initialState, {
  [AUTH_LOGIN_USER_REQUEST]: (state, payload) => {
    return {
      ...initialState,
      isAuthenticating: true,
    }
  },
  [AUTH_LOGIN_USER_SUCCESS]: (state, payload) => {
    return {
      ...initialState,
      isAuthenticated: true,
      token: payload.token,
      username: payload.user.username,
      email: payload.user.email,
    }
  },
  [AUTH_LOGIN_USER_FAILURE]: (state, payload) => {
    return {
      ...initialState,
      statusText: `Authentication Error (${payload.statusCode}): ${payload.error}`,
    }
  },
  [AUTH_LOGOUT_USER_REQUEST]: (state, payload) => {
    return {
      ...initialState,
      isAuthenticating: true,
    }
  },
  [AUTH_LOGOUT_USER_SUCCESS]: (state, payload) => {
    return initialState
  },
  [AUTH_LOGOUT_USER_FAILURE]: (state, payload) => {
    return initialState
  },
})
