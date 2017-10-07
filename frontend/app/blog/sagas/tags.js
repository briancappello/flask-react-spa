import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'

import { listTags } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectTags } from 'blog/reducers/tags'


export const KEY = 'tags'

export const maybeListTagsSaga = function *() {
  const { isLoading, isLoaded } = yield select(selectTags)
  if (!(isLoaded || isLoading)) {
    yield put(listTags.trigger())
  }
}

export const listTagsSaga = createRoutineSaga(
  listTags,
  function *successGenerator() {
    const tags = yield call(BlogApi.listTags)
    yield put(listTags.success({ tags }))
  }
)

export default () => [
  takeEvery(listTags.MAYBE_TRIGGER, maybeListTagsSaga),
  takeLatest(listTags.TRIGGER, listTagsSaga),
]
