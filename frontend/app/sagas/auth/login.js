import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'actions/flash'
import { login } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineFormSaga } from 'sagas'


export const loginSaga = createRoutineFormSaga(
  login,
  function *successGenerator(actionPayload) {
    const { redirect, ...payload } = actionPayload
    const { token, user } = yield call(AuthApi.login, payload)
    yield put(login.success({ token, user }))
    yield put(push(redirect))
    yield put(flashSuccess('You have been successfully logged in.'))
  },
)

export default () => [
  takeLatest(login.TRIGGER, loginSaga),
]
