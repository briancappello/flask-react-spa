import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { bindRoutineCreators } from 'actions'
import { fetchProfile } from 'actions/auth'
import { PageContent } from 'components/Content'

import UserInfo from './UserInfo'
import ChangePassword from './ChangePassword'


class Profile extends Component {
  componentWillMount() {
    this.props.fetchProfile.maybeTrigger()
  }

  render() {
    return (
      <PageContent>
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <div className="row">
          <div className="six cols">
            <UserInfo/>
          </div>
          <div className="six cols">
            <ChangePassword/>
          </div>
        </div>
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => bindRoutineCreators({ fetchProfile }, dispatch),
)(Profile)
