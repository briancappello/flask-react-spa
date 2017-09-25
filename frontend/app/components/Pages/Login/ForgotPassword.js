import React from 'react'
import Helmet from 'react-helmet'
import { reduxForm, actions } from 'redux-form'
const { reset } = actions

import { forgotPassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField } from 'components/Form'


const ForgotPassword = (props) => {
  const { error, handleSubmit, submitting, pristine } = props
  return (
    <PageContent>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <div className="row">
        <div className="six cols offset-by-three">
          <h1>Forgot Password</h1>
          {error && <DangerAlert>{error}</DangerAlert>}
          <form onSubmit={handleSubmit(forgotPassword)}>
            <EmailField name="email"
                        label="Email Address"
                        className="full-width"
                        autoFocus
            />
            <div className="row">
              <button type="submit"
                      className="btn btn-primary"
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
  form: 'forgotPassword',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('forgotPassword'))
  },
})(ForgotPassword)
