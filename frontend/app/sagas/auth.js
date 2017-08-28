import { takeLatest, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'actions/flash'
import { login, logout } from 'actions/auth'
import Api from 'utils/api'

export function *authLoginUserSaga(action) {
  const { redirect, ...payload } = action.payload
  try {
    yield put(login.request())
    const { token, user } = yield call(Api.login, payload)
    yield put(login.success({ token, user }))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  } catch (e) {
    const { status, error } = e.response
    yield put(login.failure({ statusCode: status, error }))
  } finally {
    yield put(login.fulfill())
  }
}

export function *authLogoutUserSaga() {
  try {
    yield put(logout.request())
    const data = yield call(Api.logout)
    yield put(logout.success(data))
    yield put(push('/'))
    yield put(flashSuccess('You have been successfully logged out.'))
  } catch (e) {
    yield put(logout.failure(e))
  } finally {
    yield put(logout.fulfill())
  }
}

export default () => [
  takeLatest(login.TRIGGER, authLoginUserSaga),
  takeLatest(logout.TRIGGER, authLogoutUserSaga),
]
