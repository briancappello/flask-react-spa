import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, reset } from 'redux-form'

import { changePassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PasswordField } from 'components/Form'


const FORM_NAME = 'changePassword'

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.submitSucceeded) {
      this.resetForm()
    }
  }

  resetForm() {
    this.setState({ formVisible: false })
    this.props.reset(FORM_NAME)
  }

  renderShowFormButton() {
    return (
      <button type="button"
              className="btn"
              onClick={() => this.setState({ formVisible: true })}
      >
        Click to change your password
      </button>
    )
  }

  renderForm() {
    const {error, handleSubmit, pristine, submitting} = this.props
    return (
      <div>
        {error && <DangerAlert>{error}</DangerAlert>}
        <form onSubmit={handleSubmit(changePassword)}>
          <PasswordField name="password"
                         label="Current Password"
                         autoFocus
          />
          <PasswordField name="newPassword"
                         label="New Password"
          />
          <PasswordField name="newPasswordConfirm"
                         label="Confirm New Password"
          />
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    disabled={pristine || submitting}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            {' '}
            <button type="button"
                    className="btn"
                    onClick={() => this.resetForm()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h2>Change Password!</h2>
        {this.state.formVisible
          ? this.renderForm()
          : this.renderShowFormButton()
        }
      </div>
    )
  }
}

const ChangePasswordForm = reduxForm({
  form: FORM_NAME,
})(ChangePassword)

export default connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({ reset }, dispatch),
)(ChangePasswordForm)
