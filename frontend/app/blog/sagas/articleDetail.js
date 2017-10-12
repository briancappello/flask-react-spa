import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { createRoutineSaga } from 'sagas'
import { convertDates } from 'utils'

import { loadArticleDetail } from 'blog/actions'
import BlogApi from 'blog/api'
import { selectArticleDetail } from 'blog/reducers/articleDetail'


export const KEY = 'articleDetail'

export const maybeLoadArticleDetailSaga = function *(article) {
  const { bySlug, isLoading } = yield select(selectArticleDetail)
  const isLoaded = !!bySlug[article.slug]
  if (!(isLoaded || isLoading)) {
    yield put(loadArticleDetail.trigger(article))
  }
}

export const loadArticleDetailSaga = createRoutineSaga(
  loadArticleDetail,
  function *successGenerator({ payload: payloadArticle }) {
    const { article, prev, next } = yield call(BlogApi.loadArticleDetail, payloadArticle)
    yield put(loadArticleDetail.success({
      article: {
        ...convertDates(['lastUpdated', 'publishDate'])(article),
        prev,
        next,
      },
    }))
  }
)

export default () => [
  takeEvery(loadArticleDetail.MAYBE_TRIGGER, maybeLoadArticleDetailSaga),
  takeLatest(loadArticleDetail.TRIGGER, loadArticleDetailSaga),
]
