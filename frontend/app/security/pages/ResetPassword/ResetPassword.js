import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import reduxForm from 'redux-form/es/reduxForm'
import Helmet from 'react-helmet'

import { resetPassword } from 'security/actions'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { HiddenField, PasswordField } from 'components/Form'
import { injectSagas } from 'utils/async'


const FORM_NAME = 'resetPassword'

const ResetPassword = (props) => {
  const { error, handleSubmit, pristine, submitting } = props
  return (
    <PageContent>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1>Reset Password</h1>
      {error && <DangerAlert>{error}</DangerAlert>}
      <p>Enter a new password and click submit to reset your password and login.</p>
      <form onSubmit={handleSubmit(resetPassword)}>
        <HiddenField name="token" />
        <PasswordField name="newPassword"
                       autoFocus
        />
        <PasswordField name="confirmNewPassword"
                       label="Confirm New Password"
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
    </PageContent>
  )
}

const withForm = reduxForm({ form: FORM_NAME })

const withConnect = connect(
  (state, props) => ({
    initialValues: {
      token: props.match.params.token,
    },
  }),
)

const withSagas = injectSagas(require('security/sagas/resetPassword'))

export default compose(
  withConnect,
  withForm,
  withSagas,
)(ResetPassword)
