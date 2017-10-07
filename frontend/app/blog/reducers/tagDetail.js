import { loadTagDetail } from 'blog/actions'


export const KEY = 'tagDetail'

const initialState = {
  isLoading: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { tag } = payload || {}
  const { slugs, bySlug } = state

  switch (type) {
    case loadTagDetail.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case loadTagDetail.SUCCESS:
      if (!slugs.includes(tag.slug)) {
        slugs.push(tag.slug)
      }
      bySlug[tag.slug] = tag
      return { ...state,
        slugs,
        bySlug,
      }

    case loadTagDetail.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectTagDetail = (state) => state[KEY]
export const selectTagBySlug = (state, slug) => selectTagDetail(state).bySlug[slug]
