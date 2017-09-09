import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

export default function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps)
    }

    checkAuth(props) {
      const { isAuthenticated, location, push } = props
      if (!isAuthenticated) {
        push(`/login?next=${location.pathname}`)
      }
    }

    render() {
      const { isAuthenticated, location, push, ...props } = this.props
      return isAuthenticated
        ? <Component {...props} />
        : null
    }
  }

  return connect(
    (state) => ({ isAuthenticated: state.auth.isAuthenticated }),
    (dispatch) => bindActionCreators({ push }, dispatch),
  )(AuthenticatedComponent)
}
