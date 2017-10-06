import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { flashSuccess } from 'actions/flash'
import { resetPassword } from 'actions/auth'
import AuthApi from 'api/auth'
import { ROUTES, ROUTE_MAP } from 'routes'
import { createRoutineFormSaga } from 'sagas'


export const KEY = 'resetPassword'

export const resetPasswordSaga = createRoutineFormSaga(
  resetPassword,
  function *successGenerator(actionPayload) {
    const { token: resetToken, ...payload } = actionPayload
    const { token, user } = yield call(AuthApi.resetPassword, resetToken, payload)
    yield put(resetPassword.success({ token, user }))
    yield put(push(ROUTE_MAP[ROUTES.Home].path))
    yield put(flashSuccess('Welcome back! Your password has been successfully changed.'))
  },
)

export default () => [
  takeLatest(resetPassword.TRIGGER, resetPasswordSaga),
]
