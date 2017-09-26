import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'actions/flash'
import { logout } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineSaga } from 'sagas'


export const logoutSaga = createRoutineSaga(
  logout,
  function *successGenerator() {
    const response = yield call(AuthApi.logout)
    yield put(logout.success(response))
    yield put(push('/'))
    yield put(flashSuccess('You have been successfully logged out.'))
  },
)

export default () => [
  takeLatest(logout.TRIGGER, logoutSaga),
]
