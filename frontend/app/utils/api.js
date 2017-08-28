import { SERVER_URL } from 'config'
import { get, post, authedGet, authedPost } from './request'

class Api {
  constructor(token) {
    this.token = token
  }

  getProtected() {
    return authedGet(`${SERVER_URL}/api/v1/test`, this.token)
  }

  login(email, password) {
    return post(`${SERVER_URL}/auth/login`, { email, password })
  }

  logout() {
    return get(`${SERVER_URL}/auth/logout`)
  }
}

export const API = new Api(localStorage.getItem('token'))
export default API
