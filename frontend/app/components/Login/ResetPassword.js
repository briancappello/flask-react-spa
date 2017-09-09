import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Helmet from 'react-helmet'

import { bindRoutineCreators } from 'actions'
import { resetPassword } from 'actions/auth'

import { PageContent } from 'components/Content'


class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.resetPassword.trigger({
      token: this.props.params.token,
      ...this.state,
    })
  }

  render() {
    const { newPassword, newPasswordConfirm } = this.state
    const { isSubmitting, errors } = this.props
    return (
      <PageContent>
        <Helmet>
          <title>Reset Password</title>
        </Helmet>
        <h1>Reset Password</h1>
        <p>Enter a new password and click submit to reset your password and login.</p>
        <form>
          <div className={`row ${classnames({ error: errors.newPassword })}`}>
            <label htmlFor="newPassword">New Password</label>
            <input type="password"
                   id="newPassword"
                   autoFocus
                   value={newPassword}
                   onChange={(e) => this.setState({ newPassword: e.target.value })}
            />
            {errors.newPassword && <div className="help">{errors.newPassword}</div>}
          </div>
          <div className={`row ${classnames({ error: errors.newPasswordConfirm })}`}>
            <label htmlFor="newPasswordConfirm">Confirm New Password</label>
            <input type="password"
                   id="newPasswordConfirm"
                   value={newPasswordConfirm}
                   onChange={(e) => this.setState({ newPasswordConfirm: e.target.value })}
            />
            {errors.newPasswordConfirm && <div className="help">{errors.newPasswordConfirm}</div>}
          </div>
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    onClick={this.onSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </PageContent>
    )
  }
}

export default connect(
  (state) => state.auth.resetPassword,
  (dispatch) => bindRoutineCreators({ resetPassword }, dispatch),
)(ResetPassword)
