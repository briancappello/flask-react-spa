import {
  changePassword,
  login,
  logout,
  fetchProfile,
  resendConfirmationEmail,
  signUp,
  updateProfile,
} from 'actions/auth'
import storage from 'utils/storage'

export const initialState = {
  isAuthenticated: false,
  token: null,
  user: {},
  changePassword: {
    isSubmitting: false,
    success: false,
    errors: {},
  },
  loginLogout: {
    isAuthenticating: false,
    error: null,
  },
  profile: {
    isLoading: false,
    isLoaded: false,
    isSubmitting: false,
    errors: {},
  },
  resendConfirmationEmail: {
    isSubmitting: false,
    emailSent: false,
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

    case changePassword.REQUEST:
      return { ...state,
        changePassword: { ...state.changePassword,
          isSubmitting: true,
          success: false,
        },
      }

    case changePassword.SUCCESS:
      return { ...state,
        token: payload.token,
        changePassword: { ...state.changePassword,
          success: true,
        },
      }

    case changePassword.FAILURE:
      return { ...state,
        changePassword: { ...state.changePassword,
          errors: payload.errors,
        },
      }

    case changePassword.FULFILL:
      return { ...state,
        changePassword: { ...state.changePassword,
          isSubmitting: false,
        },
      }

    case login.REQUEST:
      return { ...state,
        loginLogout: { ...state.loginLogout,
          isAuthenticating: true,
        },
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
      const { error } = payload
      storage.doLogout()
      return { ...state,
        loginLogout: { ...state.loginLogout,
          error,
        },
      }

    case login.FULFILL:
      return { ...state,
        loginLogout: { ...state.loginLogout,
          isAuthenticating: false,
        },
      }

    case logout.REQUEST:
      return { ...state,
        loginLogout: { ...state.loginLogout,
          isAuthenticating: true,
        },
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

    case resendConfirmationEmail.REQUEST:
      return { ...state,
        resendConfirmationEmail: { ...state.resendConfirmationEmail,
          isSubmitting: true,
        },
      }

    case resendConfirmationEmail.SUCCESS:
      return { ...state,
        resendConfirmationEmail: { ...state.resendConfirmationEmail,
          emailSent: true,
          error: null,
        },
      }

    case resendConfirmationEmail.FAILURE:
      return { ...state,
        resendConfirmationEmail: { ...state.resendConfirmationEmail,
          emailSent: false,
          error: payload.errors.email[0],
        },
      }

    case resendConfirmationEmail.FULFILL:
      return { ...state,
        resendConfirmationEmail: { ...state.resendConfirmationEmail,
          isSubmitting: false,
        },
      }

    case updateProfile.REQUEST:
      return { ...state,
        profile: { ...state.profile,
          isSubmitting: true,
        },
      }

    case updateProfile.SUCCESS:
      return { ...state,
        user: { ...state.user,
          ...payload.user,
        },
        profile: { ...state.profile,
          errors: {},
          isLoaded: true,
        },
      }

    case updateProfile.FAILURE:
      return { ...state,
        profile: { ...state.profile,
          errors: payload.errors,
        },
      }

    case updateProfile.FULFILL:
      return { ...state,
        profile: { ...state.profile,
          isSubmitting: false,
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
