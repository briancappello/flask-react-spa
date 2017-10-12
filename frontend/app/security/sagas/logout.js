import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'site/actions'
import { ROUTES, ROUTE_MAP } from 'routes'
import { createRoutineSaga } from 'sagas'

import { logout } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'logout'

export const logoutSaga = createRoutineSaga(
  logout,
  function *successGenerator() {
    yield call(SecurityApi.logout)
    yield put(logout.success())
    yield put(push(ROUTE_MAP[ROUTES.Home].path))
    yield put(flashSuccess('You have been successfully logged out.'))
  },
)

export default () => [
  takeLatest(logout.TRIGGER, logoutSaga),
]
