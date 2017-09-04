import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { changePassword } from 'actions/auth'

const initialState = {
  password: '',
  newPassword: '',
  newPasswordConfirm: '',
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentWillReceiveProps(nextProps) {
    const { success } = nextProps
    if (success) {
      this.setState(initialState)
    }
  }

  handleInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value,
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.changePassword.trigger(this.state)
  }

  render() {
    const { isSubmitting, errors } = this.props
    const { password, newPassword, newPasswordConfirm } = this.state
    return (
      <div>
        <h2>Change Password</h2>
        <form>
          <div className={`row ${classnames({ error: errors.password })}`}>
            <label htmlFor="password">Current Password</label>
            <input type="password"
                   placeholder="Current Password"
                   id="password"
                   ref="password"
                   value={password}
                   onChange={(e) => this.handleInputChange(e, 'password')}
            />
            {errors.password && <div className="help">{errors.password}</div>}
          </div>
          <div className={`row ${classnames({ error: errors.newPassword })}`}>
            <label htmlFor="newPassword">New Password</label>
            <input type="password"
                   placeholder="New Password"
                   id="newPassword"
                   ref="newPassword"
                   value={newPassword}
                   onChange={(e) => this.handleInputChange(e, 'newPassword')}
            />
            {errors.newPassword && <div className="help">{errors.newPassword}</div>}
          </div>
          <div className={`row ${classnames({ error: errors.newPasswordConfirm })}`}>
            <label htmlFor="newPasswordConfirm">Confirm New Password</label>
            <input type="password"
                   placeholder="Confirm New Password"
                   id="newPasswordConfirm"
                   ref="newPasswordConfirm"
                   value={newPasswordConfirm}
                   onChange={(e) => this.handleInputChange(e, 'newPasswordConfirm')}
            />
            {errors.newPasswordConfirm && <div className="help">{errors.newPasswordConfirm}</div>}
          </div>
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    onClick={this.onSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  (state) => state.auth.changePassword,
  (dispatch) => bindRoutineCreators({ changePassword }, dispatch),
)(ChangePassword)
