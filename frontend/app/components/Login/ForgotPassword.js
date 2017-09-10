import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import { reduxForm, reset } from 'redux-form'

import { flashInfo } from 'actions/flash'
import { forgotPassword } from 'actions/auth'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField } from 'components/Form'
import { required } from 'components/Form/validators'


class ForgotPassword extends React.Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push('/')
      flashInfo('You are already logged in.')
    }
  }

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

const ForgotPasswordForm = reduxForm({
  form: 'forgotPassword',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('forgotPassword'))
  },
})(ForgotPassword)

export default connect(
  (state) => ({ isAuthenticated: state.auth.isAuthenticated }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(ForgotPasswordForm)
