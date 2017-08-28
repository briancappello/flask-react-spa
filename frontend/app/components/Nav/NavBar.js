import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Link from './Link'
import routes from 'routes'
import { topLevelMenu } from 'utils/menu'
import { authLogoutUserRequest } from 'actions/auth'

class NavBar extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  logout = (e) => {
    e.preventDefault()
    this.props.authLogoutUserRequest()
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
            {topLevelMenu(routes, /* excludePaths= */ ['login', '*'])}
          </div>
          <div className="menu right">
            {this.props.isAuthenticated
              ? <a href="#" onClick={this.logout}>
                  Logout
                </a>
              : <Link to="/login">Login</Link>}
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  routing: state.routing, // required for <Link> components to work correctly
})

export default connect(
  mapStateToProps,
  (dispatch) => bindActionCreators({ authLogoutUserRequest }, dispatch),
)(NavBar)
