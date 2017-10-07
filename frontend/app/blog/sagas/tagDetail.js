import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'
import { convertDates } from 'utils'

import { loadTagDetail } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectTagDetail } from 'blog/reducers/tagDetail'


export const KEY = 'tagDetail'

export const maybeLoadTagDetailSaga = function *(tag) {
  const { bySlug, isLoading } = yield select(selectTagDetail)
  const isLoaded = !!bySlug[tag.slug]
  if (!(isLoaded || isLoading)) {
    yield put(loadTagDetail.trigger(tag))
  }
}

export const loadTagDetailSaga = createRoutineSaga(
  loadTagDetail,
  function *successGenerator({ payload: tag }) {
    tag = yield call(BlogApi.loadTagDetail, tag)
    tag.articles = tag.articles.map(convertDates(['lastUpdated', 'publishDate']))
    yield put(loadTagDetail.success({ tag }))
  }
)

export default () => [
  takeEvery(loadTagDetail.MAYBE_TRIGGER, maybeLoadTagDetailSaga),
  takeLatest(loadTagDetail.TRIGGER, loadTagDetailSaga),
]
