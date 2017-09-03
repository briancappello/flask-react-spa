import { put } from 'redux-saga/effects'

import authSagas from './auth'
import protectedSagas from './protected'


export function createRoutineSaga(routine, apiMethodGenerator) {
  return function *({ payload }) {
    try {
      yield put(routine.request())
      const response = yield apiMethodGenerator(payload)
      yield put(routine.success(response))
    } catch (e) {
      yield put(routine.failure(e.response))
    } finally {
      yield put(routine.fulfill())
    }
  }
}

export default () => [
  ...authSagas(),
  ...protectedSagas(),
]
