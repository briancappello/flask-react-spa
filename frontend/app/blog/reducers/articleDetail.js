import { loadArticleDetail } from 'blog/actions'


export const KEY = 'articleDetail'

const initialState = {
  isLoading: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { article } = payload || {}
  const { slugs, bySlug } = state

  switch (type) {
    case loadArticleDetail.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case loadArticleDetail.SUCCESS:
      if (!slugs.includes(article.slug)) {
        slugs.push(article.slug)
      }
      bySlug[article.slug] = article
      return { ...state,
        slugs,
        bySlug,
      }

    case loadArticleDetail.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectArticleDetail = (state) => state[KEY]
export const selectArticleDetailBySlug = (state, slug) => selectArticleDetail(state).bySlug[slug]
