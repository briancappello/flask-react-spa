import {
  login,
  logout,
  fetchProfile,
  signUp,
} from 'actions/auth'
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
  signUp: {
    isSubmitting: false,
    errors: {},
  }
}

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case login.REQUEST:
      return { ...state,
        isAuthenticating: true,
      }

    case login.SUCCESS:
      const { token, user } = payload
      storage.doLogin(token, user)
      return { ...state,
        isAuthenticated: true,
        token,
        user,
      }

    case login.FAILURE:
      const { status, error } = payload
      storage.doLogout()
      return { ...state,
        statusText: `Authentication Error (${status}): ${error}`,
      }

    case login.FULFILL:
      return { ...state,
        isAuthenticating: false,
      }

    case logout.REQUEST:
      return { ...state,
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
          ...payload.user,
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

    case signUp.REQUEST:
      return { ...state,
        signUp: { ...state.signUp,
          isSubmitting: true,
        },
      }

    case signUp.SUCCESS:
      return { ...state,
        user: { ...state.user,
          ...payload.user,
        },
        profile: { ...state.profile,
          isLoaded: true,
        },
        signUp: { ...state.signUp,
          errors: {},
        }
      }

    case signUp.FAILURE:
      return { ...state,
        signUp: { ...state.signUp,
          errors: payload.errors,
        }
      }

    case signUp.FULFILL:
      return { ...state,
        signUp: { ...state.signUp,
          isSubmitting: false,
        },
      }
  }
  return state
}

export const selectAuth = (state) => state.auth
