import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { selectAuth } from 'reducers/auth'
import { flashClear, flashSuccess } from 'actions/flash'
import {
  changePassword,
  forgotPassword,
  resetPassword,
  login,
  logout,
  fetchProfile,
  updateProfile,
  resendConfirmationEmail,
  signUp,
} from 'actions/auth'
import Api from 'utils/api'
import { createRoutineSaga } from 'sagas'

export const changePasswordSaga = createRoutineSaga(changePassword, function *(payload) {
  const response = yield call(Api.changePassword, payload)
  yield put(flashSuccess('Your password has been successfully changed.'))
  return response
})

export const forgotPasswordSaga = createRoutineSaga(forgotPassword, function *(payload) {
  const response = yield call(Api.forgotPassword, payload)
  yield put(flashSuccess('A password reset link has been sent to your email address.'))
  return response
})

export const resetPasswordSaga = createRoutineSaga(resetPassword, function *(actionPayload) {
  const { token: resetToken, ...payload } = actionPayload
  const { token, user } = yield call(Api.resetPassword, resetToken, payload)
  yield put(login.success({ token, user }))
  yield put(fetchProfile.success({ user }))
  yield put(push('/'))
  yield put(flashSuccess('Welcome back! Your password has been successfully changed.'))
  return { token, user }
})

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
  const response = yield call(Api.fetchProfile, token, user)
  return { user: response }
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
  yield put(flashSuccess('Your profile has been successfully updated.'))
  return { user: response }
})

export const resendConfirmationEmailSaga = createRoutineSaga(resendConfirmationEmail, function *({ email }) {
  const response = yield call(Api.resendConfirmationEmail, email)
  yield put(flashSuccess('A new confirmation link has been sent your email address.'))
  return response
})

export default () => [
  takeLatest(changePassword.TRIGGER, changePasswordSaga),
  takeLatest(forgotPassword.TRIGGER, forgotPasswordSaga),
  takeLatest(resetPassword.TRIGGER, resetPasswordSaga),
  takeLatest(login.TRIGGER, loginSaga),
  takeLatest(logout.TRIGGER, logoutSaga),
  takeEvery(fetchProfile.MAYBE_TRIGGER, fetchProfileIfNeeded),
  takeLatest(fetchProfile.TRIGGER, fetchProfileSaga),
  takeLatest(resendConfirmationEmail.TRIGGER, resendConfirmationEmailSaga),
  takeLatest(signUp.TRIGGER, signUpSaga),
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
