import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { fetchProfile, updateProfile } from 'actions/auth'
import { TextField } from 'components/Form'


class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, props.user || {})
  }

  componentWillMount() {
    this.props.fetchProfile.maybeTrigger()
  }

  componentWillReceiveProps(nextProps) {
    const { isSubmitting, errors } = nextProps.profile
    if (!(isSubmitting || Object.keys(errors).length)) {
      this.setState(nextProps.user)
    }
  }

  handleInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value || null,
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.updateProfile.trigger(this.state)
  }

  render() {
    const { username, email } = this.state
    const { errors, isSubmitting } = this.props.profile
    return (
      <div>
        <h2>Update Profile</h2>
        <form>
          <div className={`row ${classnames({ error: errors.username })}`}>
            <label htmlFor="username">Username</label>
            <TextField name="username"
                       value={username}
                       onChange={(e) => this.handleInputChange(e, 'username')}
            />
            {errors.username && <span className="help">{errors.username}</span>}
          </div>
          <div className={`row ${classnames({ error: errors.email })}`}>
            <label htmlFor="email">Email</label>
            <TextField name="email"
                       value={email}
                       onChange={(e) => this.handleInputChange(e, 'email')}
            />
            {errors.email && <span className="help">{errors.email}</span>}
          </div>
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    onClick={this.onSubmit}
                    disabled={isSubmitting}
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
  (state) => ({
    user: state.auth.user,
    profile: state.auth.profile,
  }),
  (dispatch) => bindRoutineCreators({ fetchProfile, updateProfile }, dispatch),
)(UserInfo)
