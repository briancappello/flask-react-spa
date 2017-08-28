import { takeLatest, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { flashSuccess } from 'actions/flash'

import {
  AUTH_LOGIN_USER_REQUEST,
  authLoginUserSuccess,
  authLoginUserFailure,

  AUTH_LOGOUT_USER_REQUEST,
  authLogoutUserSuccess,
  authLogoutUserFailure,
} from 'actions/auth'

import Api from 'utils/api'

export function *authLoginUser(action) {
  const { redirect, ...payload } = action.payload
  try {
    const { token, user } = yield call(Api.login, payload)
    yield put(authLoginUserSuccess(token, user))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  } catch (e) {
    const { status, error } = e.response
    yield put(authLoginUserFailure({ statusCode: status, error }))
  }
}

export function *authLogoutUser() {
  try {
    const data = yield call(Api.logout)
    yield put(authLogoutUserSuccess(data))
    yield put(push('/'))
    yield put(flashSuccess('You have been successfully logged out.'))
  } catch (e) {
    yield put(authLogoutUserFailure(e))
  }
}

export default () => [
  takeLatest(AUTH_LOGIN_USER_REQUEST, authLoginUser),
  takeLatest(AUTH_LOGOUT_USER_REQUEST, authLogoutUser),
]
