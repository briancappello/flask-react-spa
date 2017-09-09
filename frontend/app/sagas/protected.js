import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { selectAuth } from 'reducers/auth'
import { selectProtected } from 'reducers/protected'
import { fetchProtected } from 'actions/protected'
import { createRoutineSaga } from 'sagas'

import Api from 'utils/api'

export const fetchProtectedSaga = createRoutineSaga(fetchProtected, function *() {
  const { token } = yield select(selectAuth)
  const response = yield call(Api.fetchProtected, token)
  yield put(fetchProtected.success(response))
})

export function *fetchProtectedIfNeeded() {
    const { isLoaded, isLoading } = yield select(selectProtected)
    if (!(isLoaded || isLoading)) {
      yield put(fetchProtected.trigger())
    }
}

export default () => [
  takeLatest(fetchProtected.TRIGGER, fetchProtectedSaga),
  takeEvery(fetchProtected.MAYBE_TRIGGER, fetchProtectedIfNeeded),
]
