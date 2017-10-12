import React from 'react'
import { compose } from 'redux'
import reduxForm from 'redux-form/es/reduxForm'
import Helmet from 'react-helmet'

import { signUp } from 'security/actions'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField, PasswordField, TextField } from 'components/Form'
import { injectSagas } from 'utils/async'


const FORM_NAME = 'signUp'

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
            <TextField name="firstName"
                       className="full-width"
                       autoFocus
            />
            <TextField name="lastName"
                       className="full-width"
            />
            <TextField name="username"
                       className="full-width"
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

const withForm = reduxForm({ form: FORM_NAME })

const withSagas = injectSagas(require('security/sagas/signUp'))

export default compose(
  withForm,
  withSagas,
)(SignUp)
