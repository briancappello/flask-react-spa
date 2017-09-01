import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { bindRoutineCreators } from 'actions'
import { login } from 'actions/auth'
import { flashInfo, flashDanger } from 'actions/flash'
import { PageContent } from 'components/Content'


class Login extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    statusText: PropTypes.string,

    push: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    flashInfo: PropTypes.func.isRequired,
    flashDanger: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { location } = this.props

    this.state = {
      email: '',
      password: '',
      redirectTo: location ? location.query.next || '/' : '/',
    }
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.push('/')
      this.props.flashInfo('You are already logged in.')
    }
  }

  login = (e) => {
    e.preventDefault()
    const { email, password, redirectTo } = this.state
    this.props.login.trigger({ email, password, redirect: redirectTo })
  }

  handleInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value || null,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { statusText, flashDanger } = nextProps
    if (statusText) {
      flashDanger(statusText, null)
    }
  }

  render() {
    return (
      <PageContent>
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Log in!</h1>
            <p>Hint: a@a.com / pw</p>
            <form>
              <div className="row">
                <label htmlFor="username">Username</label>
                <input type="text"
                       id="username"
                       placeholder="Username"
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
                        disabled={this.props.isAuthenticating}
                        onClick={this.login}
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText,
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    ...bindRoutineCreators({ login }, dispatch),
    ...bindActionCreators({ flashInfo, flashDanger, push }, dispatch),
  })
)(Login)
