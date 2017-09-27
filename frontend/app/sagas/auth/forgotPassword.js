import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'actions/flash'
import { forgotPassword } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineFormSaga } from 'sagas'


export const forgotPasswordSaga = createRoutineFormSaga(
  forgotPassword,
  function *successGenerator(payload) {
    yield call(AuthApi.forgotPassword, payload)
    yield put(forgotPassword.success())
    yield put(flashSuccess('A password reset link has been sent to your email address.'))
  },
)

export default () => [
  takeLatest(forgotPassword.TRIGGER, forgotPasswordSaga),
]
