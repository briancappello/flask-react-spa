import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import classnames from 'classnames'
import { reduxForm, reset } from 'redux-form'
import Helmet from 'react-helmet'

import { resendConfirmationEmail } from 'actions/auth'
import { flashInfo } from 'actions/flash'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField } from 'components/Form'


class ResendConfirmation extends React.Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push('/')
      flashInfo('You are already logged in.')
    }
  }

  render() {
    const { error, handleSubmit, pristine, submitting, submitSucceeded } = this.props
    return (
      <PageContent>
        <Helmet>
          <title>Resend Confirmation Email</title>
        </Helmet>
        <h1>Oops, that confirmation link has expired.</h1>
        <h5>A new link should have been sent to your email address.</h5>
        <p>Please check your mail and try again.</p>
        <h6>Didn't receive an email? Enter your address below to try again.</h6>
        <div className="row">
          <div className="four cols">
            {error && <DangerAlert>{error}</DangerAlert>}
            <form onSubmit={handleSubmit(resendConfirmationEmail)}>
              <EmailField name="email"
                          label="Email address"
                          className="full-width"
                          disabled={submitSucceeded}
              />
              <div className="row">
                <button className={`btn ${classnames({
                  'btn-primary': !submitSucceeded,
                  'btn-success': submitSucceeded,
                })}`}
                        type="submit"
                        disabled={pristine || submitting || submitSucceeded}
                        onClick={this.onSubmit}
                >
                  {submitSucceeded
                    ? 'Email sent!'
                    : submitting
                      ? 'Sending...'
                      : 'Send new confirmation link'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </PageContent>
    )
  }
}

const ResendConfirmationForm = reduxForm({
  form: 'resendConfirmation',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('resendConfirmation'))
  },
})(ResendConfirmation)

export default connect(
  (state) => ({ isAuthenticated: state.auth.isAuthenticated }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(ResendConfirmationForm)
