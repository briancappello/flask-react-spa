import {
  resetPassword,
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
  profile: {
    isLoading: false,
    isLoaded: false,
  },
  resendConfirmationEmail: {
    isSubmitting: false,
    emailSent: false,
    error: null,
  },
  resetPassword: {
    isSubmitting: false,
    errors: {},
  },
  signUp: {
    isSubmitting: false,
    error: {},
    errors: {},
  }
}

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {

    case resetPassword.REQUEST:
      return { ...state,
        resetPassword: { ...state.resetPassword,
          isSubmitting: true,
        },
      }

    case resetPassword.SUCCESS:
      return { ...state,
        resetPassword: { ...state.resetPassword,
          errors: {},
        },
      }

    case resetPassword.FAILURE:
      return { ...state,
        resetPassword: { ...state.resetPassword,
          errors: payload.errors,
        },
      }

    case resetPassword.FULFILL:
      return { ...state,
        resetPassword: { ...state.resetPassword,
          isSubmitting: false,
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
    case logout.SUCCESS:
    case logout.FAILURE:
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

    case updateProfile.SUCCESS:
      return { ...state,
        user: { ...state.user,
          ...payload.user,
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
          error: {},
          errors: {},
        }
      }

    case signUp.FAILURE:
      return { ...state,
        signUp: { ...state.signUp,
          error: payload,
          errors: payload.errors || {},
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
