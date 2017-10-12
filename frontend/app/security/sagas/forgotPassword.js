import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'site/actions'
import { createRoutineFormSaga } from 'sagas'

import { forgotPassword } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'forgotPassword'

export const forgotPasswordSaga = createRoutineFormSaga(
  forgotPassword,
  function *successGenerator(payload) {
    yield call(SecurityApi.forgotPassword, payload)
    yield put(forgotPassword.success())
    yield put(flashSuccess('A password reset link has been sent to your email address.'))
  },
)

export default () => [
  takeLatest(forgotPassword.TRIGGER, forgotPasswordSaga),
]
