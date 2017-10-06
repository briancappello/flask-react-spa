import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'actions/flash'
import { logout } from 'actions/auth'
import AuthApi from 'api/auth'
import { ROUTES, ROUTE_MAP } from 'routes'
import { createRoutineSaga } from 'sagas'


export const KEY = 'logout'

export const logoutSaga = createRoutineSaga(
  logout,
  function *successGenerator() {
    yield call(AuthApi.logout)
    yield put(logout.success())
    yield put(push(ROUTE_MAP[ROUTES.Home].path))
    yield put(flashSuccess('You have been successfully logged out.'))
  },
)

export default () => [
  takeLatest(logout.TRIGGER, logoutSaga),
]
