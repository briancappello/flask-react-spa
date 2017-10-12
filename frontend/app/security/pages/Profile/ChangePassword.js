import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import reduxForm from 'redux-form/es/reduxForm'
import formActions from 'redux-form/es/actions'
const { reset } = formActions

import { changePassword } from 'security/actions'
import { DangerAlert } from 'components/Alert'
import { PasswordField } from 'components/Form'
import { injectSagas } from 'utils/async'


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
          <PasswordField name="confirmNewPassword"
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

const withForm = reduxForm({ form: FORM_NAME })

const withConnect = connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({ reset }, dispatch),
)

const withSagas = injectSagas(require('security/sagas/changePassword'))

export default compose(
  withConnect,
  withForm,
  withSagas,
)(ChangePassword)
