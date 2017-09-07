import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {
  render() {
    const {
      component: Component,
      isAuthenticated,
      location,
      ...props,
    } = this.props

    return <Route {...props} render={(props) => (
      isAuthenticated
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            search: `?next=${location.pathname}`,
          }} />
    )} />
  }
}

export default connect(
  (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
  }),
)(ProtectedRoute)
