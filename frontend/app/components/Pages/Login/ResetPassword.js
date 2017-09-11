import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Helmet from 'react-helmet'

import { resetPassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { HiddenField, PasswordField } from 'components/Form'
import { required } from 'components/Form/validators'


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
        <PasswordField name="newPassword" validate={[required]} />
        <PasswordField name="newPasswordConfirm"
                       label="Confirm New Password"
                       validate={[required]}
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

const ResetPasswordForm = reduxForm({
  form: 'resetPassword',
})(ResetPassword)

export default connect(
  (state, props) => ({
    initialValues: {
      token: props.match.params.token,
    },
  }),
)(ResetPasswordForm)
