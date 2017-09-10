import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, reset } from 'redux-form'

import { changePassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PasswordField } from 'components/Form'
import { required } from 'components/Form/validators'


class ChangePassword extends React.Component {
  render() {
    const { error, handleSubmit, pristine, submitting } = this.props
    return (
      <div>
        <h2>Change Password</h2>
        {error && <DangerAlert>{error}</DangerAlert>}
        <form onSubmit={handleSubmit(changePassword)}>
          <PasswordField name="password"
                         label="Current Password"
                         validate={[required]}
          />
          <PasswordField name="newPassword"
                         label="New Password"
                         validate={[required]}
          />
          <PasswordField name="newPasswordConfirm"
                         label="Confirm New Password"
                         validate={[required]}
          />
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    disabled={pristine || submitting}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'changePassword',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('changePassword'))
  },
})(ChangePassword)
