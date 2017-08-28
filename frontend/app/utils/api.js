import { SERVER_URL } from 'config'
import { get, post, authedGet, authedPost } from './request'

export default class Api {
  static getProtected(token) {
    return authedGet(`${SERVER_URL}/api/v1/test`, token)
  }

  static login(payload) {
    return post(`${SERVER_URL}/auth/login`, payload)
  }

  static logout() {
    return get(`${SERVER_URL}/auth/logout`)
  }
}
