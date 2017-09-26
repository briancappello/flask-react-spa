import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'actions/flash'
import { changePassword } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineFormSaga } from 'sagas'


export const changePasswordSaga = createRoutineFormSaga(
  changePassword,
  function *successGenerator(payload) {
    const response = yield call(AuthApi.changePassword, payload)
    yield put(changePassword.success(response))
    yield put(flashSuccess('Your password has been successfully changed.'))
  },
)

export default () => [
  takeLatest(changePassword.TRIGGER, changePasswordSaga),
]
