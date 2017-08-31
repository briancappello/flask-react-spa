import { SERVER_URL } from 'config'
import { get, post, authedGet, authedPost } from './request'

function url(uri) {
  return `${SERVER_URL}${uri}`
}

export default class Api {
  static fetchProtected(token) {
    return authedGet(url('/api/v1/test'), token)
  }

  static fetchProfile(token, user) {
    return authedGet(url(`/api/v1/users/${user.id}`), token)
  }

  static login(payload) {
    return post(url('/api/v1/auth/login'), payload)
  }

  static checkAuthToken(token) {
    return authedGet(url('/api/v1/auth/check-auth-token'), token)
  }

  static logout() {
    return get(url('/api/v1/auth/logout'))
  }
}
