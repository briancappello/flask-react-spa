import { login, logout, fetchProfile } from 'actions/auth'
import storage from 'utils/storage'

export const initialState = {
  token: null,
  user: {},
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
  profile: {
    isLoading: false,
    isLoaded: false,
    error: null,
  },
}

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case login.REQUEST:
      return {
        ...initialState,
        isAuthenticating: true,
      }

    case login.SUCCESS:
      const { token, user } = payload
      storage.doLogin(token, user)
      return {
        ...initialState,
        isAuthenticated: true,
        token,
        user,
      }

    case login.FAILURE:
      const { response: { status, error } } = payload
      storage.doLogout()
      return {
        ...initialState,
        statusText: `Authentication Error (${status}): ${error}`,
      }

    case login.FULFILL:
      return { ...state,
        isAuthenticating: false,
      }

    case logout.REQUEST:
      return {
        ...initialState,
        isAuthenticating: true,
      }

    case logout.SUCCESS:
    case logout.FULFILL:
      storage.doLogout()
      return initialState

    case fetchProfile.REQUEST:
      return { ...state,
        profile: { ...state.profile,
          isLoading: true,
        },
      }

    case fetchProfile.SUCCESS:
      return { ...state,
        user: { ...state.user,
          ...payload,
        },
        profile: { ...state.profile,
          isLoaded: true,
        },
      }

    case fetchProfile.FAILURE:
      return { ...state,
        profile: { ...state.profile,
          isLoaded: false,
        },
      }

    case fetchProfile.FULFILL:
      return { ...state,
        profile: { ...state.profile,
          isLoading: false,
        },
      }
  }
  return state
}

export const selectAuth = (state) => state.auth
