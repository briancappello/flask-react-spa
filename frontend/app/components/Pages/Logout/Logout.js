import React from 'react'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { logout } from 'actions/auth'


class Logout extends React.Component {
  componentWillMount() {
    this.props.logout.trigger()
  }

  render() {
    return null
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => bindRoutineCreators({ logout }, dispatch),
)(Logout)
