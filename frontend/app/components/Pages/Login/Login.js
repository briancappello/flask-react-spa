import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import reduxForm from 'redux-form/es/reduxForm'
import { parse } from 'query-string'

import { login } from 'actions/auth'
import { DangerAlert, PageContent } from 'components'
import { Link } from 'components/Nav'
import { HiddenField, PasswordField, TextField } from 'components/Form'


const Login = (props) => {
  const isDev = process.env.NODE_ENV !== 'production'
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
          {isDev && <p>Hint: a@a.com / password</p>}
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

const withForm = reduxForm({
  form: 'login',
})

const withConnect = connect(
  (state, props) => ({
    initialValues: {
      redirect: parse(props.location.search).next || '/',
    }
  })
)

export default compose(
  withConnect,
  withForm,
)(Login)
