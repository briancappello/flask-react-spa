import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import { reduxForm } from 'redux-form'
import { parse as parseQueryString } from 'query-string'

import { login } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import { PageContent } from 'components/Content'
import { Link } from 'components/Nav'
import { HiddenField, PasswordField, TextField } from 'components/Form'
import { required } from 'components/Form/validators'


class Login extends React.Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push('/')
      flashInfo('You are already logged in.')
    }
  }

  render() {
    const { children, error, handleSubmit, submitting, pristine } = this.props

    if (children) {
      return children
    }

    return (
      <PageContent>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Log in!</h1>
            {error && <div className="flash danger">{error}</div>}
            {error && <br/>}
            <p>Hint: a@a.com / password</p>
            <form onSubmit={handleSubmit(login)}>
              <HiddenField name="redirect" />
              <TextField autoFocus name="email"
                         label="Email or Username"
                         className="full-width"
                         validate={[required]}
              />
              <PasswordField name="password"
                             className="full-width"
                             validate={[required]}
              />
              <div className="row">
                <button type="submit"
                        className="btn btn-primary"
                        disabled={pristine || submitting}
                >
                  {submitting ? 'Logging in...' : 'Submit'}
                </button>
                <Link to="/login/forgot-password"
                      className="pull-right"
                      style={{ lineHeight: '38px' }}
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </PageContent>
    )
  }
}

const LoginForm = reduxForm({
  form: 'login',
})(Login)

export default connect(
  (state, props) => {
    const query = parseQueryString(props.location.search)
    return {
      isAuthenticated: state.auth.isAuthenticated,
      initialValues: {
        redirect: query.next || '/',
      },
    }
  },
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(LoginForm)
