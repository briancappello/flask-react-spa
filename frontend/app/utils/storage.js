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
      const token = localStorage.getItem('token')
      // FIXME: this crap is probably indicative of a bug somewhere...
      this.token = token == 'null' || token == 'undefined' ? null : token
    }
    return this.token
  }

  getUser() {
    if (!this.user) {
      let user
      try {
        user = JSON.parse(localStorage.getItem('user'))
      } catch (e) {
        user = null
      }
      // FIXME: this crap is probably indicative of a bug somewhere...
      this.user = user == 'null' || user == 'undefined' ? null : user
    }
    return this.user
  }
}

export default new Storage()
