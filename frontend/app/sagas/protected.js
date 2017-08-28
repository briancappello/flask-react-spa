import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { selectAuth } from 'reducers/auth'
import { selectProtected } from 'reducers/protected'
import {
  PROTECTED_REQUEST,
  FETCH_PROTECTED_IF_NEEDED,
  protectedRequest,
  protectedSuccess,
  protectedFailure,
} from 'actions/protected'

import Api from 'utils/api'

export function *fetchProtected() {
  try {
    const { token } = yield select(selectAuth)
    const data = yield call(Api.getProtected, token)
    yield put(protectedSuccess(data))
  } catch (e) {
    yield put(protectedFailure(e))
  }
}

export function *fetchProtectedIfNeeded() {
    const { isLoaded, isLoading } = yield select(selectProtected)
    if (!(isLoaded || isLoading)) {
      yield put(protectedRequest())
    }
}

export default () => [
  takeLatest(PROTECTED_REQUEST, fetchProtected),
  takeEvery(FETCH_PROTECTED_IF_NEEDED, fetchProtectedIfNeeded),
]
