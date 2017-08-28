import { push } from 'react-router-redux'

export const AUTH_LOGIN_USER_REQUEST = 'AUTH_LOGIN_USER_REQUEST'
export const AUTH_LOGIN_USER_SUCCESS = 'AUTH_LOGIN_USER_SUCCESS'
export const AUTH_LOGIN_USER_FAILURE = 'AUTH_LOGIN_USER_FAILURE'

export const AUTH_LOGOUT_USER_REQUEST = 'AUTH_LOGOUT_USER_REQUEST'
export const AUTH_LOGOUT_USER_SUCCESS = 'AUTH_LOGOUT_USER_SUCCESS'
export const AUTH_LOGOUT_USER_FAILURE = 'AUTH_LOGOUT_USER_FAILURE'

// FIXME: sessionStorage vs localStorage

export function authLoginUserRequest(email, password, redirect = '/') {
  return {
    type: AUTH_LOGIN_USER_REQUEST,
    payload: { email, password, redirect },
  }
}

export function authLoginUserSuccess(token, user) {
  localStorage.setItem('token', token)
  return {
    type: AUTH_LOGIN_USER_SUCCESS,
    payload: { token, user },
  }
}

export function authLoginUserFailure(error) {
  localStorage.removeItem('token')
  return {
    type: AUTH_LOGIN_USER_FAILURE,
    payload: error,
  }
}

export function authLogoutUserRequest() {
  return {
    type: AUTH_LOGOUT_USER_REQUEST,
  }
}

export function authLogoutUserSuccess() {
  localStorage.removeItem('token')
  return {
    type: AUTH_LOGOUT_USER_SUCCESS,
  }
}

export function authLogoutUserFailure() {
  localStorage.removeItem('token')
  return {
    type: AUTH_LOGOUT_USER_FAILURE,
  }
}
