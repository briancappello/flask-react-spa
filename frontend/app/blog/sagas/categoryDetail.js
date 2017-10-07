import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'
import { convertDates } from 'utils'

import { loadCategoryDetail } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectCategoryDetail } from 'blog/reducers/categoryDetail'


export const KEY = 'categoryDetail'

export const maybeLoadCategoryDetailSaga = function *(category) {
  const { bySlug, isLoading } = yield select(selectCategoryDetail)
  const isLoaded = !!bySlug[category.slug]
  if (!(isLoaded || isLoading)) {
    yield put(loadCategoryDetail.trigger(category))
  }
}

export const loadCategoryDetailSaga = createRoutineSaga(
  loadCategoryDetail,
  function *successGenerator({ payload: category }) {
    category = yield call(BlogApi.loadCategoryDetail, category)
    const dateConverter = convertDates(['lastUpdated', 'publishDate'])
    category.articles = category.articles.map(dateConverter)
    yield put(loadCategoryDetail.success({ category }))
  }
)

export default () => [
  takeEvery(loadCategoryDetail.MAYBE_TRIGGER, maybeLoadCategoryDetailSaga),
  takeLatest(loadCategoryDetail.TRIGGER, loadCategoryDetailSaga),
]
