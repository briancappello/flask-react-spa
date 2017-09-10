import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import Helmet from 'react-helmet'

import { resetPassword } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { HiddenField, PasswordField } from 'components/Form'
import { required } from 'components/Form/validators'


class ResetPassword extends React.Component {
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
}

const ResetPasswordForm = reduxForm({
  form: 'resetPassword',
})(ResetPassword)

export default connect(
  (state, props) => ({
    isAuthenticated: state.auth.isAuthenticated,
    initialValues: {
      token: props.match.params.token,
    },
  }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(ResetPasswordForm)
