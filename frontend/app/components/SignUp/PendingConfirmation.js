import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'

import { flashInfo } from 'actions/flash'
import { PageContent } from 'components/Content'


class PendingConfirmation extends React.Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push('/')
      flashInfo('You are already logged in.')
    }
  }

  render() {
    return (
      <PageContent>
        <Helmet>
          <title>Please Confirm your Email Address</title>
        </Helmet>
        <h1>Thanks for signing up!</h1>
        <p>Please check your email to confirm your email address and login.</p>
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({ isAuthenticated: state.auth.isAuthenticated }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(PendingConfirmation)
