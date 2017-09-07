import React, { Component } from 'react'
import { connect } from 'react-redux'

import Link from './Link'


class NavBar extends Component {
  // FIXME: mostly works, except for responsive menu behavior
  render() {
    const { isAuthenticated } = this.props
    return (
      <nav>
        <div className="container">
          <Link exact to="/" className="brand">
            flask<span className="tld">api</span>
          </Link>
          <div className="menu left">
            <Link to="/about">About</Link>
            <Link to="/styles">Styles</Link>
            <Link to="/protected">Protected</Link>
          </div>
          <div className="menu right">
            {isAuthenticated
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
        <Link to="/sign-up">Sign Up</Link>
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
