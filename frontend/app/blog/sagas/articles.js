import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'
import { convertDates } from 'utils'

import { listArticles } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectArticles } from 'blog/reducers/articles'


export const KEY = 'articles'

export const maybeListArticlesSaga = function *() {
  const { isLoading, isLoaded } = yield select(selectArticles)
  if (!(isLoaded || isLoading)) {
    yield put(listArticles.trigger())
  }
}

export const listArticlesSaga = createRoutineSaga(
  listArticles,
  function *successGenerator() {
    const articles = yield call(BlogApi.listArticles)
    yield put(listArticles.success({
      articles: articles.map(convertDates(['lastUpdated', 'publishDate'])),
    }))
  },
)

export default () => [
  takeEvery(listArticles.MAYBE_TRIGGER, maybeListArticlesSaga),
  takeLatest(listArticles.TRIGGER, listArticlesSaga),
]
