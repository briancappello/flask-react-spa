import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { signUp } from 'actions/auth'
import { selectAuth } from 'reducers/auth'

import { PageContent } from 'components/Content'

class SignUp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: null,
      email: null,
      password: null,
    }
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.push('/')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { username, email, password } = this.state
    this.props.signUp.trigger({ username, email, password })
  }

  handleInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value || null,
    })
  }

  render() {
    if (this.props.children) {
      return this.props.children
    }

    const { isSubmitting, error, errors } = this.props

    return (
      <PageContent>
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Sign Up</h1>
            {error.status == 500 && <div className="flash danger">{error.statusText}</div>}
            {error.status == 500 && <br/>}
            <form>
              <div className={`row ${classnames({ error: errors.username })}`}>
                <label htmlFor="username">Username</label>
                <input type="text"
                       id="username"
                       autoFocus
                       placeholder="Username"
                       className="full-width"
                       onChange={(e) => this.handleInputChange(e, 'username')}
                />
                {errors.username && <span className="help">{errors.username}</span>}
              </div>
              <div className={`row ${classnames({ error: errors.email })}`}>
                <label htmlFor="email">Email</label>
                <input type="email"
                       id="email"
                       placeholder="Email"
                       className="full-width"
                       onChange={(e) => this.handleInputChange(e, 'email')}
                />
                {errors.email && <span className="help">{errors.email}</span>}
              </div>
              <div className={`row ${classnames({ error: errors.password })}`}>
                <label htmlFor="password">Password</label>
                <input type="password"
                       id="password"
                       placeholder="Password"
                       className="full-width"
                       onChange={(e) => this.handleInputChange(e, 'password')}
                />
                {errors.password && <span className="help">{errors.password}</span>}
              </div>
              <div className="row">
                <button type="submit" className="button-primary"
                        disabled={isSubmitting}
                        onClick={this.onSubmit}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
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
  (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    ...selectAuth(state).signUp,
  }),
  (dispatch) => ({
    ...bindRoutineCreators({ signUp }, dispatch),
    ...bindActionCreators({ push }, dispatch),
  }),
)(SignUp)
