import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import reduxForm from 'redux-form/es/reduxForm'

import { bindRoutineCreators } from 'actions'
import { updateProfile } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { EmailField, TextField } from 'components/Form'
import { injectSagas } from 'utils/async'


const FORM_NAME = 'updateProfile'

const UpdateProfile = (props) => {
  const { error, handleSubmit, pristine, submitting } = props
  return (
    <div>
      <h2>Update Profile!</h2>
      {error && <DangerAlert>{error}</DangerAlert>}
      <form onSubmit={handleSubmit(updateProfile)}>
        <TextField name="firstName"
                   autoFocus
        />
        <TextField name="lastName" />
        <TextField name="username" />
        <EmailField name="email" />
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

const withForm = reduxForm({ form: FORM_NAME })

const withConnect = connect(
  (state) => ({ initialValues: state.auth.user }),
)

const withSagas = injectSagas(require('sagas/auth/updateProfile'))

export default compose(
  withConnect,
  withForm,
  withSagas,
)(UpdateProfile)
