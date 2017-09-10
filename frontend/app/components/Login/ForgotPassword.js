import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { reduxForm, reset } from 'redux-form'

import { forgotPassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField } from 'components/Form'
import { required } from 'components/Form/validators'


class ForgotPassword extends React.Component {
  render() {
    const { error, handleSubmit, submitting, pristine } = this.props
    return (
      <PageContent>
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
        <h1>Forgot Password</h1>
        {error && <DangerAlert>{error}</DangerAlert>}
        <form onSubmit={handleSubmit(forgotPassword)}>
          <EmailField autoFocus name="email"
                      label="Email Address"
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

export default reduxForm({
  form: 'forgotPassword',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('forgotPassword'))
  },
})(ForgotPassword)
