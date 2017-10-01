import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'actions/flash'
import { resendConfirmationEmail } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineFormSaga } from 'sagas'


export const KEY = 'resendConfirmation'

export const resendConfirmationEmailSaga = createRoutineFormSaga(
  resendConfirmationEmail,
  function *successGenerator({ email }) {
    yield call(AuthApi.resendConfirmationEmail, email)
    yield put(resendConfirmationEmail.success())
    yield put(flashSuccess('A new confirmation link has been sent your email address.'))
  },
)

export default () => [
  takeLatest(resendConfirmationEmail.TRIGGER, resendConfirmationEmailSaga),
]
