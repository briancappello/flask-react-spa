import { put } from 'redux-saga/effects'

import authSagas from './auth'
import protectedSagas from './protected'


export function createRoutineSaga(routine, successGenerator, failureGenerator) {
  if (!failureGenerator) {
    failureGenerator = function *(e) {
      yield put(routine.failure(e.response))
    }
  }
  return function *({ payload }) {
    try {
      yield put(routine.request())
      yield successGenerator(payload)
    } catch (e) {
      yield failureGenerator(e)
    } finally {
      yield put(routine.fulfill())
    }
  }
}

export default () => [
  ...authSagas(),
  ...protectedSagas(),
]
