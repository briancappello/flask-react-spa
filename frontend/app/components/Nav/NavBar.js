import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Link from './Link'
import routes from 'routes'
import { topLevelMenu } from 'utils/menu'


class NavBar extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    // mostly works, except for responsive menu behavior
    return (
      <nav>
        <div className="container">
          <Link to="/" className="brand" onlyActiveOnIndex={true}>
            flask
            <span className="tld">api</span>
          </Link>
          <div className="menu left">
            {topLevelMenu(routes, /* excludePaths= */ ['login', 'logout', 'profile', '*'])}
          </div>
          <div className="menu right">
            {this.props.isAuthenticated
              ? this.renderAuthenticatedMenu()
              : this.renderUnauthenticatedMenu()
            }
          </div>
        </div>
      </nav>
    )
  }

  renderAuthenticatedMenu() {
    return (
      <div>
        <Link to="/profile">Profile</Link>
        <Link to="/logout">Logout</Link>
      </div>
    )
  }

  renderUnauthenticatedMenu() {
    return (
      <div>
        <Link to="/login">Login</Link>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    routing: state.routing, // required for <Link> components to work correctly
  }),
  (dispatch) => ({}),
)(NavBar)
