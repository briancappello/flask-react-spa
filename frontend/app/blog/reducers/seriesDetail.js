import { loadSeriesDetail } from 'blog/actions'


export const KEY = 'seriesDetail'

const initialState = {
  isLoading: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { series } = payload || {}
  const { slugs, bySlug } = state

  switch (type) {
    case loadSeriesDetail.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case loadSeriesDetail.SUCCESS:
      if (!slugs.includes(series.slug)) {
        slugs.push(series.slug)
      }
      bySlug[series.slug] = series
      return { ...state,
        slugs,
        bySlug,
      }

    case loadSeriesDetail.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectSeriesDetail = (state) => state[KEY]
export const selectSeriesDetailBySlug = (state, slug) => selectSeriesDetail(state).bySlug[slug]
