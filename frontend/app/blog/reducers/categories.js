import { listCategories } from 'blog/actions'


export const KEY = 'categories'

const initialState = {
  isLoading: false,
  isLoaded: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { categories } = payload || {}

  switch (type) {
    case listCategories.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case listCategories.SUCCESS:
      return { ...state,
        isLoaded: true,
        slugs: categories.map((category) => category.slug),
        bySlug: categories.reduce((bySlug, category) => {
          bySlug[category.slug] = category
          return bySlug
        }, {})
      }

    case listCategories.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectCategories = (state) => state[KEY]
export const selectCategoriesList = (state) => {
  const categories = selectCategories(state)
  return categories.slugs.map((slug) => categories.bySlug[slug])
}
