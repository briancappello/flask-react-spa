import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'site/actions'
import { createRoutineFormSaga } from 'sagas'

import { login } from 'security/actions'
import SecurityApi from 'security/api'


export const KEY = 'login'

export const loginSaga = createRoutineFormSaga(
  login,
  function *successGenerator(actionPayload) {
    const { redirect, ...payload } = actionPayload
    const { token, user } = yield call(SecurityApi.login, payload)
    yield put(login.success({ token, user }))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  },
)

export default () => [
  takeLatest(login.TRIGGER, loginSaga),
]
