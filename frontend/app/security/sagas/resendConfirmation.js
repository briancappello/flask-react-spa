import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'site/actions'
import { createRoutineFormSaga } from 'sagas'

import { resendConfirmationEmail } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'resendConfirmation'

export const resendConfirmationEmailSaga = createRoutineFormSaga(
  resendConfirmationEmail,
  function *successGenerator({ email }) {
    yield call(SecurityApi.resendConfirmationEmail, email)
    yield put(resendConfirmationEmail.success())
    yield put(flashSuccess('A new confirmation link has been sent your email address.'))
  },
)

export default () => [
  takeLatest(resendConfirmationEmail.TRIGGER, resendConfirmationEmailSaga),
]
