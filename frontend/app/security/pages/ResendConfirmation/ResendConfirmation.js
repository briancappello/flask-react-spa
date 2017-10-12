import React from 'react'
import { compose } from 'redux'
import Helmet from 'react-helmet'
import classnames from 'classnames'
import reduxForm from 'redux-form/es/reduxForm'
import formActions from 'redux-form/es/actions'
const { reset } = formActions

import { resendConfirmationEmail } from 'security/actions'
import { DangerAlert } from 'components/Alert'
import { PageContent } from 'components/Content'
import { EmailField } from 'components/Form'
import { injectSagas } from 'utils/async'


const FORM_NAME = 'resendConfirmation'

const ResendConfirmation = (props) => {
  const { error, handleSubmit, pristine, submitting, submitSucceeded } = props
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

const withForm = reduxForm({
  form: FORM_NAME,
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset(FORM_NAME))
  },
})

const withSagas = injectSagas(require('security/sagas/resendConfirmation'))

export default compose(
  withForm,
  withSagas,
)(ResendConfirmation)
