import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import Helmet from 'react-helmet'

import { flashInfo } from 'actions/flash'
import { signUp } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField, PasswordField, TextField } from 'components/Form'
import { required } from 'components/Form/validators'
import { selectAuth } from 'reducers/auth'


class SignUp extends Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push('/')
      flashInfo('You are already logged in.')
    }
  }

  render() {
    const { error, handleSubmit, pristine, submitting } = this.props
    return (
      <PageContent>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Sign Up</h1>
            {error && <DangerAlert>{error}</DangerAlert>}
            <form onSubmit={handleSubmit(signUp)}>
              <TextField name="username"
                         className="full-width"
                         validate={[required]}
              />
              <EmailField name="email"
                          className="full-width"
                          validate={[required]}
              />
              <PasswordField name="password"
                             className="full-width"
                             validate={[required]}
              />
              <div className="row">
                <button type="submit"
                        className="button-primary"
                        disabled={pristine || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PageContent>
    )
  }
}

const SignUpForm = reduxForm({
  form: 'signUp',
})(SignUp)

export default connect(
  (state) => ({ isAuthenticated: state.auth.isAuthenticated }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(SignUpForm)
