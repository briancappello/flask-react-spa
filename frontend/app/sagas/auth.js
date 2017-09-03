import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { selectAuth } from 'reducers/auth'
import { flashClear, flashSuccess } from 'actions/flash'
import {
  checkAuthToken,
  login,
  logout,
  fetchProfile,
  updateProfile,
  resendConfirmationEmail,
  signUp,
} from 'actions/auth'
import Api from 'utils/api'
import { createRoutineSaga } from 'sagas'

export const loginSaga = createRoutineSaga(login, function *(actionPayload) {
  const { redirect, ...payload } = actionPayload
  const { token, user } = yield call(Api.login, payload)
  yield put(push(redirect))
  yield put(flashSuccess('You have been successfully logged in.'))
  return { token, user }
})

export const logoutSaga = createRoutineSaga(logout, function *() {
  const response = yield call(Api.logout)
  yield put(push('/'))
  yield put(flashSuccess('You have been successfully logged out.'))
  return response
})

export function *fetchProfileIfNeeded() {
  const { isAuthenticated, profile: { isLoading, isLoaded } } = yield select(selectAuth)
  if (isAuthenticated && !(isLoaded || isLoading)) {
    yield put(fetchProfile.trigger())
  }
}

export const fetchProfileSaga = createRoutineSaga(fetchProfile, function *() {
  const { token, user } = yield select(selectAuth)
  const data = yield call(Api.fetchProfile, token, user)
  return { user: data }
})

export const signUpSaga = createRoutineSaga(signUp, function *(payload) {
  const { token, user } = yield call(Api.signUp, payload)
    if (token) {
      yield put(login.success({ token, user }))
      yield put(push('/?welcome'))
    } else {
      yield put(push('/sign-up/pending-confirm-email'))
    }
    return { user }
})

export const updateProfileSaga = createRoutineSaga(updateProfile, function *(payload) {
  yield put(flashClear())
  const { token, user } = yield select(selectAuth)
  const response = yield call(Api.updateProfile, token, user, payload)
  yield put(flashSuccess('Profile successfully updated.'))
  return { user: response }
})

export const resendConfirmationEmailSaga = createRoutineSaga(resendConfirmationEmail, function *({ email }) {
  const response = yield call(Api.resendConfirmationEmail, email)
  yield put(flashSuccess('A new confirmation link has been sent your email address.'))
  return response
})

export default () => [
  takeLatest(login.TRIGGER, loginSaga),
  takeLatest(logout.TRIGGER, logoutSaga),
  takeEvery(fetchProfile.MAYBE_TRIGGER, fetchProfileIfNeeded),
  takeLatest(fetchProfile.TRIGGER, fetchProfileSaga),
  takeLatest(resendConfirmationEmail.TRIGGER, resendConfirmationEmailSaga),
  takeLatest(signUp.TRIGGER, signUpSaga),
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
