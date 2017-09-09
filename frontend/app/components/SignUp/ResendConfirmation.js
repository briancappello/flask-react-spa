import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import classnames from 'classnames'
import Helmet from 'react-helmet'

import { resendConfirmationEmail } from 'actions/auth'
import { bindRoutineCreators } from 'actions'

import { PageContent } from 'components/Content'


class ResendConfirmation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
    }
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.push('/')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.resendConfirmationEmail.trigger(this.state)
  }

  render() {
    const { isSubmitting, emailSent, error } = this.props
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
            {error && <div className="flash danger">{error}</div>}
            {error && <br/>}
            <form>
              <div className="row">
                <input type="email"
                       id="email"
                       className="full-width"
                       placeholder="Email address"
                       disabled={emailSent}
                       onChange={(e) => this.setState({ email: e.target.value || null })}
                />
              </div>
              <div className="row">
                <button className={`btn ${classnames({
                  'btn-primary': !emailSent,
                  'btn-success': emailSent,
                })}`}
                        type="submit"
                        disabled={isSubmitting || emailSent}
                        onClick={this.onSubmit}
                >
                  {emailSent
                    ? 'Email sent!'
                    : isSubmitting
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

export default connect(
  (state) => {
    const { isAuthenticated, resendConfirmationEmail } = state.auth
    return {
      isAuthenticated,
      ...resendConfirmationEmail,
    }
  },
  (dispatch) => ({
    ...bindRoutineCreators({ resendConfirmationEmail }, dispatch),
    ...bindActionCreators({ push }, dispatch),
  }),
)(ResendConfirmation)
