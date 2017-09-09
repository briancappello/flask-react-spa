import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import { bindRoutineCreators } from 'actions'
import { fetchProfile, updateProfile } from 'actions/auth'
import { EmailField, TextField } from 'components/Form'
import { required } from 'components/Form/validators'


class UserInfo extends Component {
  componentWillMount() {
    this.props.fetchProfile.maybeTrigger()
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props
    return (
      <div>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit(updateProfile)}>
          <TextField autoFocus name="username" validate={[required]} />
          <EmailField name="email" validate={[required]} />
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

const UserInfoForm = reduxForm({
  form: 'userInfo',
})(UserInfo)

export default connect(
  (state) => ({ initialValues: state.auth.user }),
  (dispatch) => bindRoutineCreators({ fetchProfile }, dispatch),
)(UserInfoForm)
