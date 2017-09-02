class Storage {
  constructor() {
    this.token = null
    this.user = null
  }

  doLogin(token, user) {
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  doLogout() {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }

  getUser() {
    if (!this.user) {
      try {
        this.user = JSON.parse(localStorage.getItem('user'))
      } catch (e) {
        this.user = null
      }
    }
    return this.user
  }
}

export default new Storage()
