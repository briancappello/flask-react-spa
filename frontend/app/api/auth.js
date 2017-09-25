import {
  get,
  post,
  patch,
  url,
} from 'utils/request'
import { v1 } from './versions'


const PREFIX = '/auth'

function authUrl(uri, queryParams) {
  return url(`${PREFIX}${uri}`, queryParams)
}

function authV1(uri, queryParams) {
  return v1(`${PREFIX}${uri}`, queryParams)
}

export default class Auth {
  static changePassword(payload) {
    return post(authV1('/change-password'), payload)
  }

  static checkAuthToken(token) {
    return get(authV1('/check-auth-token'), { token })
  }

  static fetchProfile(token, user) {
    return get(authV1(`/users/${user.id}`), { token })
  }

  static forgotPassword(payload) {
    return post(authUrl('/reset'), payload)
  }

  static login(payload) {
    return post(authV1('/login'), payload)
  }

  static logout() {
    return get(authV1('/logout'))
  }

  static resendConfirmationEmail(email) {
    return post(authV1('/resend-confirmation-email'), { email })
  }

  static resetPassword(token, payload) {
    return post(authUrl(`/reset/${token}`), payload)
  }

  static signUp(payload) {
    return post(authV1('/users'), payload)
  }

  static updateProfile(token, user, payload) {
    return patch(authV1(`/users/${user.id}`), payload, { token })
  }
}
