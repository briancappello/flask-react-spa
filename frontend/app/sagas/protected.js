import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { selectAuth } from 'reducers/auth'
import { selectProtected } from 'reducers/protected'
import { fetchProtected } from 'actions/protected'

import Api from 'utils/api'

export function *fetchProtectedSaga() {
  try {
    yield put(fetchProtected.request())
    const { token } = yield select(selectAuth)
    const data = yield call(Api.getProtected, token)
    yield put(fetchProtected.success(data))
  } catch (e) {
    yield put(fetchProtected.failure(e))
  } finally {
    yield put(fetchProtected.fulfill())
  }
}

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
