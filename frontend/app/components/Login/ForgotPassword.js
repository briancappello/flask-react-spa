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
        <div className="row">
          <div className="six cols offset-by-three">
            <h1>Forgot Password</h1>
            {error && <DangerAlert>{error}</DangerAlert>}
            <form onSubmit={handleSubmit(forgotPassword)}>
              <EmailField autoFocus name="email"
                          label="Email Address"
                          className="full-width"
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
          </div>
        </div>
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
