import React from 'react'
import { reduxForm } from 'redux-form'
import Helmet from 'react-helmet'

import { signUp } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField, PasswordField, TextField } from 'components/Form'


const SignUp = (props) => {
  const { error, handleSubmit, pristine, submitting } = props
  return (
    <PageContent>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="row">
        <div className="six cols offset-by-three">
          <h1>Sign Up!</h1>
          {error && <DangerAlert>{error}</DangerAlert>}
          <form onSubmit={handleSubmit(signUp)}>
            <TextField name="username"
                       className="full-width"
                       autoFocus
            />
            <EmailField name="email"
                        className="full-width"
            />
            <PasswordField name="password"
                           className="full-width"
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

export default reduxForm({
  form: 'signUp',
})(SignUp)
