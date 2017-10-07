import { listSeries } from 'blog/actions'


export const KEY = 'series'

const initialState = {
  isLoading: false,
  isLoaded: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { series } = payload || {}
  const { bySlug } = state

  switch (type) {
    case listSeries.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case listSeries.SUCCESS:
      return { ...state,
        slugs: series.map((article) => article.slug),
        bySlug: series.reduce((bySlug, article) => {
          bySlug[article.slug] = article
          return bySlug
        }, bySlug),
        isLoaded: true,
      }

    case listSeries.FAILURE:
      return { ...state,
        error: payload.error,
      }

    case listSeries.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectSeries = (state) => state[KEY]
export const selectSeriesList = (state) => {
  const series = selectSeries(state)
  return series.slugs.map((slug) => series.bySlug[slug])
}
