import {
  changePassword,
  login,
  logout,
  resetPassword,
  signUp,
  updateProfile,
} from 'security/actions'
import { storage } from 'utils'


export const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  token: null,
  user: {},
  profile: {
    isLoading: false,
    isLoaded: false,
  },
}

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case login.REQUEST:
    case resetPassword.REQUEST:
    case signUp.REQUEST:
      return { ...state,
        isAuthenticating: true,
        profile: { ...state.profile,
          isLoading: true,
        },
      }

    case login.SUCCESS:
    case resetPassword.SUCCESS:
      const { token, user } = payload
      storage.doLogin(token, user)
      return { ...state,
        isAuthenticated: true,
        token,
        user,
        profile: { ...state.profile,
          isLoaded: true,
        },
      }

    case login.FAILURE:
    case logout.SUCCESS:
    case logout.FAILURE:
    case logout.FULFILL:
    case resetPassword.FAILURE:
      storage.doLogout()
      return initialState

    case login.FULFILL:
    case resetPassword.FULFILL:
    case signUp.FULFILL:
      return { ...state,
        isAuthenticating: false,
        profile: { ...state.profile,
          isLoading: false,
        },
      }

    case changePassword.SUCCESS:
      return { ...state,
        token: payload.token,
      }

    case updateProfile.SUCCESS:
      return { ...state,
        user: { ...state.user,
          ...payload.user,
        },
      }

    case signUp.SUCCESS:
      return { ...state,
        isAuthenticated: !!payload.token,
        token: payload.token || null,
        user: { ...state.user,
          ...payload.user,
        },
        profile: { ...state.profile,
          isLoaded: true,
        },
      }

    default:
      return state
  }
}

export const selectSecurity = (state) => state.security
