import { call, put, race, take, takeEvery } from 'redux-saga/effects'
import SubmissionError from 'redux-form/es/SubmissionError'

import { ROUTINE_PROMISE } from 'actions'


export function createRoutineSaga(routine, successGenerator, failureGenerator) {
  if (!failureGenerator) {
    failureGenerator = function *(e) {
      if (!e.response) {
        // something unexpected went wrong, probably in the successGenerator fn
        throw e
      }
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


export function createRoutineFormSaga(routine, successGenerator) {
  return createRoutineSaga(routine, successGenerator, function *onError(e) {
    if (!e.response) {
      // something unexpected went wrong, probably in the successGenerator fn
      throw e
    }
    const error = new SubmissionError(Object.assign(
      { _error: e.response.error || null },
      e.response.errors || {},
    ))
    yield put(routine.failure(error))
  })
}


export function *routineWatcherSaga({ payload }) {
  const { data, routine, defer: { resolve, reject } } = payload
  const [{ success, failure }] = yield [
    race({
      success: take(routine.SUCCESS),
      failure: take(routine.FAILURE),
    }),
    put(routine.trigger(data)),
  ]

  if (success) {
    yield call(resolve)
  } else {
    yield call(reject, failure && failure.payload || failure)
  }
}


export default () => [
  takeEvery(ROUTINE_PROMISE, routineWatcherSaga),
]
