import {
  get,
  post,
  patch,
  url,
} from 'utils/request'
import { v1 } from 'api'


const PREFIX = '/auth'

function authUrl(uri, queryParams) {
  return url(`${PREFIX}${uri}`, queryParams)
}

function authV1(uri, queryParams) {
  return v1(`${PREFIX}${uri}`, queryParams)
}

export default class Auth {
  /**
   * @param {string} password
   * @param {string} newPassword
   * @param {string} confirmNewPassword
   */
  static changePassword({ password, newPassword, confirmNewPassword }) {
    return post(authV1('/change-password'), { password, newPassword, confirmNewPassword })
  }

  /**
   * @param {string} token The user's auth token
   */
  static checkAuthToken(token) {
    return get(authV1('/check-auth-token'), { token })
  }

  /**
   * @param {string} email
   */
  static forgotPassword({ email }) {
    return post(authUrl('/reset'), { email })
  }

  /**
   * @param {string} email The username or email to authenticate
   * @param {string} password
   */
  static login({ email, password }) {
    return post(authV1('/login'), { email, password })
  }

  static logout() {
    return get(authV1('/logout'))
  }

  /**
   * @param {string} email
   */
  static resendConfirmationEmail(email) {
    return post(authV1('/resend-confirmation-email'), { email })
  }

  /**
   * @param {string} token The reset token from the URL
   * @param {string} newPassword
   * @param {string} confirmNewPassword
   */
  static resetPassword(token, { newPassword, confirmNewPassword }) {
    return post(authUrl(`/reset/${token}`), { newPassword, confirmNewPassword })
  }

  /**
   * @param {Object} payload The user details
   * @param {string} payload.firstName
   * @param {string} payload.lastName
   * @param {string} payload.username
   * @param {string} payload.email
   * @param {string} payload.password
   */
  static signUp(payload) {
    return post(authV1('/users'), payload)
  }

  /**
   * @param {object} user The user whose profile is being updated
   * @param {object} payload Any modified fields to be updated
   */
  static updateProfile(user, payload) {
    return patch(authV1(`/users/${user.id}`), payload)
  }
}
