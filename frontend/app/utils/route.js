import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { Route, Redirect } from 'react-router-dom'

import { flashInfo } from 'site/actions'
import { ROUTES, ROUTE_MAP } from 'routes'


const UnconnectedProtectedRoute = (props) => {
  const {
    component: Component,
    isAuthenticated,
    location,
    ...routeProps,
  } = props

  return <Route {...routeProps} render={(props) => (
    isAuthenticated
      ? <Component {...props} />
      : <Redirect to={{
          pathname: ROUTE_MAP[ROUTES.Login].path,
          search: `?next=${location.pathname}`,
        }} />
  )} />
}

export const ProtectedRoute = connect(
  (state) => ({ isAuthenticated: state.security.isAuthenticated }),
)(UnconnectedProtectedRoute)


class UnconnectedAnonymousRoute extends React.Component {
  componentWillMount() {
    const { isAuthenticated, push, flashInfo } = this.props
    if (isAuthenticated) {
      push(ROUTE_MAP[ROUTES.Home].path)
      flashInfo('You are already logged in.')
    }
  }

  render() {
    const {
      component: Component,
      isAuthenticated,
      push,
      flashInfo,
      ...routeProps,
    } = this.props

    return <Route {...routeProps} render={(props) => <Component {...props} />} />
  }
}

export const AnonymousRoute = connect(
  (state) => ({ isAuthenticated: state.security.isAuthenticated }),
  (dispatch) => bindActionCreators({ flashInfo, push }, dispatch),
)(UnconnectedAnonymousRoute)
