import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { bindRoutineCreators } from 'actions'
import { login } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import { PageContent } from 'components/Content'


class Login extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    error: PropTypes.string,

    push: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    flashInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { location } = this.props

    this.state = {
      email: '',
      password: '',
      redirect: location ? location.query.next || '/' : '/',
    }
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.push('/')
      this.props.flashInfo('You are already logged in.')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { email, password, redirect } = this.state
    this.props.login.trigger({ email, password, redirect })
  }

  handleInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value || null,
    })
  }

  render() {
    const { isAuthenticating, error } = this.props
    return (
      <PageContent>
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Log in!</h1>
            {error && <div className="flash danger">{error}</div>}
            {error && <br/>}
            <p>Hint: a@a.com / pw</p>
            <form>
              <div className="row">
                <label htmlFor="username">Email or Username</label>
                <input type="text"
                       id="username"
                       placeholder="Email or Username"
                       className="full-width"
                       onChange={(e) => this.handleInputChange(e, 'email')}
                />
              </div>
              <div className="row">
                <label htmlFor="password">Password</label>
                <input type="password"
                       id="password"
                       placeholder="Password"
                       className="full-width"
                       onChange={(e) => this.handleInputChange(e, 'password')}
                />
              </div>
              <div className="row">
                <button type="submit"
                        className="btn btn-primary"
                        disabled={isAuthenticating}
                        onClick={this.onSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </PageContent>
    )
  }
}

export default connect(
  (state) => {
    const { isAuthenticated, loginLogout } = state.auth
    return {
      isAuthenticated: isAuthenticated,
      isAuthenticating: loginLogout.isAuthenticating,
      error: loginLogout.error,
    }
  },
  (dispatch) => ({
    ...bindRoutineCreators({ login }, dispatch),
    ...bindActionCreators({ flashInfo, push }, dispatch),
  })
)(Login)
