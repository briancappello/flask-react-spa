import { listTags } from 'blog/actions'


export const KEY = 'tags'

const initialState = {
  isLoading: false,
  isLoaded: false,
  slugs: [],
  bySlug: {},
  error: null,
}

export default function(state = initialState, action) {
  const { type, payload } = action
  const { tags } = payload || {}

  switch (type) {
    case listTags.REQUEST:
      return { ...state,
        isLoading: true,
      }

    case listTags.SUCCESS:
      return { ...state,
        isLoaded: true,
        slugs: tags.map((tag) => tag.slug),
        bySlug: tags.reduce((bySlug, tag) => {
          bySlug[tag.slug] = tag
          return bySlug
        }, {})
      }

    case listTags.FULFILL:
      return { ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const selectTags = (state) => state[KEY]
export const selectTagsList = (state) => {
  const tags = selectTags(state)
  return tags.slugs.map((slug) => tags.bySlug[slug])
}
