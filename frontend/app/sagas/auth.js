import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { SubmissionError } from 'redux-form'

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
import { createRoutineSaga, createRoutineFormSaga } from 'sagas'

export const changePasswordSaga = createRoutineFormSaga(
  changePassword,
  function *successGenerator(payload) {
    const response = yield call(Api.changePassword, payload)
    yield put(changePassword.success(response))
    yield put(flashSuccess('Your password has been successfully changed.'))
  },
)

export const forgotPasswordSaga = createRoutineFormSaga(
  forgotPassword,
  function *successGenerator(payload) {
    const response = yield call(Api.forgotPassword, payload)
    yield put(forgotPassword.success(response))
    yield put(flashSuccess('A password reset link has been sent to your email address.'))
  },
)

export const resetPasswordSaga = createRoutineFormSaga(
  resetPassword,
  function *successGenerator(actionPayload) {
    const { token: resetToken, ...payload } = actionPayload
    const { token, user } = yield call(Api.resetPassword, resetToken, payload)
    yield put(login.success({ token, user }))
    yield put(fetchProfile.success({ user }))
    yield put(resetPassword.success({ token, user }))
    yield put(push('/'))
    yield put(flashSuccess('Welcome back! Your password has been successfully changed.'))
  },
)

export const loginSaga = createRoutineFormSaga(
  login,
  function *successGenerator(actionPayload) {
    const { redirect, ...payload } = actionPayload
    const response = yield call(Api.login, payload)
    yield put(login.success(response))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  },
)

export const logoutSaga = createRoutineSaga(
  logout,
  function *successGenerator() {
    const response = yield call(Api.logout)
    yield put(logout.success(response))
    yield put(push('/'))
    yield put(flashSuccess('You have been successfully logged out.'))
  },
)

export function *maybeFetchProfileSaga() {
  const { isAuthenticated, profile: { isLoading, isLoaded } } = yield select(selectAuth)
  if (isAuthenticated && !(isLoaded || isLoading)) {
    yield put(fetchProfile.trigger())
  }
}

export const fetchProfileSaga = createRoutineSaga(
  fetchProfile,
  function *successGenerator() {
    const { token, user } = yield select(selectAuth)
    const response = yield call(Api.fetchProfile, token, user)
    yield put(fetchProfile.success(response))
  },
)

export const signUpSaga = createRoutineFormSaga(
  signUp,
  function *successGenerator(payload) {
    const { token, user } = yield call(Api.signUp, payload)
    yield put(signUp.success({ user }))
    if (token) {
      yield put(login.success({ token, user }))
      yield put(push('/?welcome'))
    } else {
      yield put(push('/sign-up/pending-confirm-email'))
    }
  },
)

export const updateProfileSaga = createRoutineFormSaga(
  updateProfile,
  function *successGenerator(payload) {
    yield put(flashClear())
    const { token, user } = yield select(selectAuth)
    const response = yield call(Api.updateProfile, token, user, payload)
    yield put(updateProfile.success({ user: response }))
    yield put(flashSuccess('Your profile has been successfully updated.'))
  },
)

export const resendConfirmationEmailSaga = createRoutineFormSaga(
  resendConfirmationEmail,
  function *successGenerator({ email }) {
    const response = yield call(Api.resendConfirmationEmail, email)
    yield put(resendConfirmationEmail.success(response))
    yield put(flashSuccess('A new confirmation link has been sent your email address.'))
  },
)

export default () => [
  takeLatest(changePassword.TRIGGER, changePasswordSaga),
  takeLatest(forgotPassword.TRIGGER, forgotPasswordSaga),
  takeLatest(resetPassword.TRIGGER, resetPasswordSaga),
  takeLatest(login.TRIGGER, loginSaga),
  takeLatest(logout.TRIGGER, logoutSaga),
  takeEvery(fetchProfile.MAYBE_TRIGGER, maybeFetchProfileSaga),
  takeLatest(fetchProfile.TRIGGER, fetchProfileSaga),
  takeLatest(resendConfirmationEmail.TRIGGER, resendConfirmationEmailSaga),
  takeLatest(signUp.TRIGGER, signUpSaga),
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
