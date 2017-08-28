import { push } from 'react-router-redux'
import { flashSuccess, flashDanger } from 'actions/flash'
import API from 'utils/api'

export const AUTH_LOGIN_USER_REQUEST = 'AUTH_LOGIN_USER_REQUEST'
export const AUTH_LOGIN_USER_SUCCESS = 'AUTH_LOGIN_USER_SUCCESS'
export const AUTH_LOGIN_USER_FAILURE = 'AUTH_LOGIN_USER_FAILURE'

export const AUTH_LOGOUT_USER_REQUEST = 'AUTH_LOGOUT_USER_REQUEST'
export const AUTH_LOGOUT_USER_SUCCESS = 'AUTH_LOGOUT_USER_SUCCESS'
export const AUTH_LOGOUT_USER_FAILURE = 'AUTH_LOGOUT_USER_FAILURE'

// FIXME: sessionStorage vs localStorage

export function authLoginUserSuccess(token, user) {
  localStorage.setItem('token', token)
  return {
    type: AUTH_LOGIN_USER_SUCCESS,
    payload: {
      token,
      user,
    },
  }
}

export function authLoginUserFailure(error) {
  localStorage.removeItem('token')
  return {
    type: AUTH_LOGIN_USER_FAILURE,
    payload: error,
  }
}

export function authLoginUserRequest() {
  return {
    type: AUTH_LOGIN_USER_REQUEST,
  }
}

export function authLoginUser(email, password, redirect = '/') {
  return dispatch => {
    dispatch(authLoginUserRequest())
    return API.login(email, password)
      .then(response => {
        const { token, user } = response
        dispatch(authLoginUserSuccess(token, user))
        dispatch(push(redirect))
        dispatch(flashSuccess('You have been successfully logged in.'))
      })
      .catch(e => {
        const { status, error } = e.response
        dispatch(authLoginUserFailure({
          statusCode: status,
          error: error,
        }))
      })
  }
}

function authLogoutUserRequest() {
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

function authLogoutUserFailure() {
  localStorage.removeItem('token')
  return {
    type: AUTH_LOGOUT_USER_FAILURE,
  }
}

export function authLogoutAndRedirect() {
  return (dispatch, state) => {
    dispatch(authLogoutUserRequest())
    return API.logout()
      .then(_ => {
        dispatch(authLogoutUserSuccess())
        dispatch(push('/'))
        dispatch(flashSuccess('You have been successfully logged out.'))
      })
      .catch(_ => {
        dispatch(authLogoutUserFailure())
      })
  }
}
