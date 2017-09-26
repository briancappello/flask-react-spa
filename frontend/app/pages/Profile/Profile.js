import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { bindRoutineCreators } from 'actions'
import { PageContent } from 'components/Content'

import UpdateProfile from './UpdateProfile'
import ChangePassword from './ChangePassword'


export default () => (
  <PageContent>
    <Helmet>
      <title>User Profile</title>
    </Helmet>
    <div className="row">
      <div className="six cols">
        <UpdateProfile/>
      </div>
      <div className="six cols">
        <ChangePassword/>
      </div>
    </div>
  </PageContent>
)
