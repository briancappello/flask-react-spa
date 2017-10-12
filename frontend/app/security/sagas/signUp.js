import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { ROUTES, ROUTE_MAP } from 'routes'
import { createRoutineFormSaga } from 'sagas'

import { signUp } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'signUp'

export const signUpSaga = createRoutineFormSaga(
  signUp,
  function *successGenerator(payload) {
    const { token, user } = yield call(SecurityApi.signUp, payload)
    yield put(signUp.success({ token, user }))
    if (token) {
      yield put(push({
        pathname: ROUTE_MAP[ROUTES.Home].path,
        search: '?welcome',
      }))
    } else {
      yield put(push(ROUTE_MAP[ROUTES.PendingConfirmation].path))
    }
  },
)

export default () => [
  takeLatest(signUp.TRIGGER, signUpSaga),
]
