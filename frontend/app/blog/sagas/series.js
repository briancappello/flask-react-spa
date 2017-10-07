import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'

import { listSeries } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectSeries } from 'blog/reducers/series'


export const KEY = 'series'

export const maybeListSeriesSaga = function *() {
  const { isLoading, isLoaded } = yield select(selectSeries)
  if (!(isLoaded || isLoading)) {
    yield put(listSeries.trigger())
  }
}

export const listSeriesSaga = createRoutineSaga(
  listSeries,
  function *successGenerator() {
    const series = yield call(BlogApi.listSeries)
    yield put(listSeries.success({ series }))
  },
)

export default () => [
  takeEvery(listSeries.MAYBE_TRIGGER, maybeListSeriesSaga),
  takeLatest(listSeries.TRIGGER, listSeriesSaga),
]
