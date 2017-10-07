import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'
import { convertDates } from 'utils'

import { loadSeriesDetail } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectSeriesDetail } from 'blog/reducers/seriesDetail'


export const KEY = 'seriesDetail'

export const maybeLoadSeriesDetailSaga = function *(series) {
  const { bySlug, isLoading } = yield select(selectSeriesDetail)
  const isLoaded = !!bySlug[series.slug]
  if (!(isLoaded || isLoading)) {
    yield put(loadSeriesDetail.trigger(series))
  }
}

export const loadSeriesDetailSaga = createRoutineSaga(
  loadSeriesDetail,
  function *successGenerator({ payload: series }) {
    series = yield call(BlogApi.loadSeriesDetail, series)
    series.articles = series.articles.map(convertDates(['lastUpdated', 'publishDate']))
    yield put(loadSeriesDetail.success({ series }))
  }
)

export default () => [
  takeEvery(loadSeriesDetail.MAYBE_TRIGGER, maybeLoadSeriesDetailSaga),
  takeLatest(loadSeriesDetail.TRIGGER, loadSeriesDetailSaga),
]
