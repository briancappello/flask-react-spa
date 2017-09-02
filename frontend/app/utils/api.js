import { SERVER_URL } from 'config'
import {
  get,
  post,
  put,
  patch,
  delete_,
} from './request'

function url(uri) {
  return `${SERVER_URL}${uri}`
}

function v1(uri) {
  return url(`/api/v1${uri}`)
}

/**
 * Api methods
 *
 * NOTE: Please keep the order alphabetized!
 */
export default class Api {
  static checkAuthToken(token) {
    return get(v1('/auth/check-auth-token'), { token })
  }

  static fetchProfile(token, user) {
    return get(v1(`/users/${user.id}`), { token })
  }

  static fetchProtected(token) {
    return get(v1('/test'), { token })
  }

  static login(payload) {
    return post(v1('/auth/login'), payload)
  }

  static logout() {
    return get(v1('/auth/logout'))
  }
}
