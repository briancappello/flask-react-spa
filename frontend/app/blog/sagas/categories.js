import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'

import { listCategories } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectCategories } from 'blog/reducers/categories'


export const KEY = 'categories'

export const maybeListCategoriesSaga = function *() {
  const { isLoading, isLoaded } = yield select(selectCategories)
  if (!(isLoaded || isLoading)) {
    yield put(listCategories.trigger())
  }
}

export const listCategoriesSaga = createRoutineSaga(
  listCategories,
  function *successGenerator() {
    const categories = yield call(BlogApi.listCategories)
    yield put(listCategories.success({ categories }))
  },
)

export default () => [
  takeEvery(listCategories.MAYBE_TRIGGER, maybeListCategoriesSaga),
  takeLatest(listCategories.TRIGGER, listCategoriesSaga),
]
