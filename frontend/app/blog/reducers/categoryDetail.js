import { loadCategoryDetail } from 'blog/actions'


export const KEY = 'categoryDetail'

const initialState = {
  isLoading: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { category } = payload || {}
  const { slugs, bySlug } = state

  switch (type) {
    case loadCategoryDetail.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case loadCategoryDetail.SUCCESS:
      if (!slugs.includes(category.slug)) {
        slugs.push(category.slug)
      }
      bySlug[category.slug] = category
      return { ...state,
        slugs,
        bySlug,
      }

    case loadCategoryDetail.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectCategoryDetail = (state) => state[KEY]
export const selectCategoryBySlug = (state, slug) => selectCategoryDetail(state).bySlug[slug]
