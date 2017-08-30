import React, { Component } from 'react'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { fetchProfile } from 'actions/auth'
import { PageContent } from 'components/Content'


class Profile extends Component {
  componentWillMount() {
    this.props.fetchProfile.maybeTrigger()
  }

  render() {
    const { username, email } = this.props.user
    return (
      <PageContent>
        <h1>{username}'s profile!</h1>
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({ user: state.auth.user }),
  (dispatch) => bindRoutineCreators({ fetchProfile }, dispatch),
)(Profile)
