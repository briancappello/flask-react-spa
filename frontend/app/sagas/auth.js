import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { selectAuth } from 'reducers/auth'
import { flashSuccess } from 'actions/flash'
import {
  login,
  logout,
  fetchProfile,
  signUp,
} from 'actions/auth'
import Api from 'utils/api'

export function *loginSaga(action) {
  const { redirect, ...payload } = action.payload
  try {
    yield put(login.request())
    const { token, user } = yield call(Api.login, payload)
    yield put(login.success({ token, user }))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  } catch (e) {
    yield put(login.failure(e.response))
  } finally {
    yield put(login.fulfill())
  }
}

export function *logoutSaga() {
  try {
    yield put(logout.request())
    const data = yield call(Api.logout)
    yield put(logout.success(data))
    yield put(push('/'))
    yield put(flashSuccess('You have been successfully logged out.'))
  } catch (e) {
    yield put(logout.failure(e.response))
  } finally {
    yield put(logout.fulfill())
  }
}

export function *fetchProfileSaga() {
  try {
    yield put(fetchProfile.request())
    const { token, user } = yield select(selectAuth)
    const data = yield call(Api.fetchProfile, token, user)
    yield put(fetchProfile.success({ user: data }))
  } catch (e) {
    yield put(fetchProfile.failure(e.response))
  } finally {
    yield put(fetchProfile.fulfill())
  }
}

export function *fetchProfileIfNeeded() {
  const { profile: { isLoading, isLoaded } } = yield select(selectAuth)
  if (!(isLoaded || isLoading)) {
    yield put(fetchProfile.trigger())
  }
}

export function *signUpSaga({ payload }) {
  try {
    yield put(signUp.request())
    const { token, user } = yield call(Api.signUp, payload)
    yield put(signUp.success({ user }))
    if (token) {
      yield put(login.success({ token, user }))
      yield put(push('/?welcome'))
    } else {
      yield put(push('/sign-up/pending-confirm-email'))
    }
  } catch (e) {
    yield put(signUp.failure(e.response))
  } finally {
    yield put(signUp.fulfill())
  }
}

export default () => [
  takeLatest(login.TRIGGER, loginSaga),
  takeLatest(logout.TRIGGER, logoutSaga),
  takeEvery(fetchProfile.MAYBE_TRIGGER, fetchProfileIfNeeded),
  takeLatest(fetchProfile.TRIGGER, fetchProfileSaga),
  takeLatest(signUp.TRIGGER, signUpSaga),
]
