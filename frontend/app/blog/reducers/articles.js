import { listArticles } from 'blog/actions'


export const KEY = 'articles'

const initialState = {
  isLoading: false,
  isLoaded: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { articles } = payload || {}
  const { bySlug } = state

  switch (type) {
    case listArticles.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case listArticles.SUCCESS:
      return { ...state,
        slugs: articles.map((article) => article.slug),
        bySlug: articles.reduce((bySlug, article) => {
          bySlug[article.slug] = article
          return bySlug
        }, bySlug),
        isLoaded: true,
      }

    case listArticles.FAILURE:
      return { ...state,
        error: payload.error,
      }

    case listArticles.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectArticles = (state) => state[KEY]
export const selectArticlesList = (state) => {
  const articles = selectArticles(state)
  return articles.slugs.map((slug) => articles.bySlug[slug])
}
