import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { reduxForm } from 'redux-form'
import { parse } from 'query-string'

import { login } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { Link } from 'components/Nav'
import { HiddenField, PasswordField, TextField } from 'components/Form'


const Login = (props) => {
  const { error, handleSubmit, submitting, pristine } = props
  return (
    <PageContent>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="row">
        <div className="six cols offset-by-three">
          <h1>Log in!</h1>
          {error && <DangerAlert>{error}</DangerAlert>}
          <p>Hint: a@a.com / password</p>
          <form onSubmit={handleSubmit(login)}>
            <HiddenField name="redirect" />
            <TextField name="email"
                       label="Email or Username"
                       className="full-width"
                       autoFocus
            />
            <PasswordField name="password"
                           className="full-width"
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

const LoginForm = reduxForm({
  form: 'login',
})(Login)

export default connect(
  (state, props) => ({
    initialValues: {
      redirect: parse(props.location.search).next || '/',
    },
  }),
)(LoginForm)
