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
import { createRoutineSaga } from 'sagas'

export const changePasswordSaga = createRoutineSaga(changePassword,
  function *onSuccess(payload) {
    const response = yield call(Api.changePassword, payload)
    yield put(changePassword.success(response))
    yield put(flashSuccess('Your password has been successfully changed.'))
  },
  function *onError(e) {
    const error = new SubmissionError(e.response.errors)
    yield put(changePassword.failure(error))
  }
)

export const forgotPasswordSaga = createRoutineSaga(forgotPassword,
  function *onSuccess(payload) {
    const response = yield call(Api.forgotPassword, payload)
    yield put(forgotPassword.success(response))
    yield put(flashSuccess('A password reset link has been sent to your email address.'))
  },
  function *onError(e) {
    const error = new SubmissionError(e.response.response.errors)
    yield put(forgotPassword.failure(error))
  }
)

export const resetPasswordSaga = createRoutineSaga(
  resetPassword,
  function *onSuccess(actionPayload) {
    const { token: resetToken, ...payload } = actionPayload
    const { token, user } = yield call(Api.resetPassword, resetToken, payload)
    yield put(login.success({ token, user }))
    yield put(fetchProfile.success({ user }))
    yield put(resetPassword.success({ token, user }))
    yield put(push('/'))
    yield put(flashSuccess('Welcome back! Your password has been successfully changed.'))
  },
  function *onError(e) {
    const error = new SubmissionError(e.response.errors)
    yield put(resetPassword.failure(error))
  }
)

export const loginSaga = createRoutineSaga(login,
  function *onSuccess(actionPayload) {
    const { redirect, ...payload } = actionPayload
    const response = yield call(Api.login, payload)
    yield put(login.success(response))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  },
  function *onError(e) {
    const error = new SubmissionError({ _error: e.response.error })
    yield put(login.failure(error))
  }
)

export const logoutSaga = createRoutineSaga(logout, function *() {
  const response = yield call(Api.logout)
  yield put(logout.success(response))
  yield put(push('/'))
  yield put(flashSuccess('You have been successfully logged out.'))
})

export function *maybeFetchProfileSaga() {
  const { isAuthenticated, profile: { isLoading, isLoaded } } = yield select(selectAuth)
  if (isAuthenticated && !(isLoaded || isLoading)) {
    yield put(fetchProfile.trigger())
  }
}

export const fetchProfileSaga = createRoutineSaga(fetchProfile, function *() {
  const { token, user } = yield select(selectAuth)
  const response = yield call(Api.fetchProfile, token, user)
  yield put(fetchProfile.success(response))
})

export const signUpSaga = createRoutineSaga(
  signUp,
  function *onSuccess(payload) {
    const { token, user } = yield call(Api.signUp, payload)
    yield put(signUp.success({ user }))
    if (token) {
      yield put(login.success({ token, user }))
      yield put(push('/?welcome'))
    } else {
      yield put(push('/sign-up/pending-confirm-email'))
    }
  },
  function *onError(e) {
    const error = new SubmissionError(e.response.errors)
    yield put(signUp.failure(error))
  }
)

export const updateProfileSaga = createRoutineSaga(updateProfile,
  function *onSuccess(payload) {
    yield put(flashClear())
    const { token, user } = yield select(selectAuth)
    const response = yield call(Api.updateProfile, token, user, payload)
    yield put(updateProfile.success({ user: response }))
    yield put(flashSuccess('Your profile has been successfully updated.'))
  },
  function *onError(e) {
    const error = new SubmissionError(e.response.errors)
    yield put(updateProfile.failure(error))
  }
)

export const resendConfirmationEmailSaga = createRoutineSaga(resendConfirmationEmail, function *({ email }) {
  const response = yield call(Api.resendConfirmationEmail, email)
  yield put(resendConfirmationEmail.success(response))
  yield put(flashSuccess('A new confirmation link has been sent your email address.'))
})

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
