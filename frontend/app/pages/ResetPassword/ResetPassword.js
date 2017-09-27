import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import reduxForm from 'redux-form/es/reduxForm'
import Helmet from 'react-helmet'

import { resetPassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { HiddenField, PasswordField } from 'components/Form'

import resetPasswordSagas from 'sagas/auth/resetPassword'
import { DAEMON, injectSagas } from 'utils/async'


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
        <PasswordField name="newPasswordConfirm"
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

const withSagas = injectSagas({ key: FORM_NAME, sagas: resetPasswordSagas, mode: DAEMON })

export default compose(
  withConnect,
  withForm,
  withSagas,
)(ResetPassword)
