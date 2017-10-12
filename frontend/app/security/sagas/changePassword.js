import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'site/actions'
import { createRoutineFormSaga } from 'sagas'

import { changePassword } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'changePassword'

export const changePasswordSaga = createRoutineFormSaga(
  changePassword,
  function *successGenerator(payload) {
    const { token } = yield call(SecurityApi.changePassword, payload)
    yield put(changePassword.success({ token }))
    yield put(flashSuccess('Your password has been successfully changed.'))
  },
)

export default () => [
  takeLatest(changePassword.TRIGGER, changePasswordSaga),
]
