import React from 'react'
import { connect } from 'react-redux'

import { ROUTES } from 'routes'
import NavLink from './NavLink'


class NavBar extends React.Component {
  // FIXME: mostly works, except for responsive menu behavior
  render() {
    const { isAuthenticated } = this.props
    return (
      <nav>
        <div className="container">
          <NavLink exact to={ROUTES.Home} className="brand">
            FlaskReact<span className="tld">SPA</span>
          </NavLink>
          <div className="menu left">
            <NavLink to={ROUTES.About} />
            <NavLink to={ROUTES.Styles} />
            <NavLink to={ROUTES.Contact} />
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
        <NavLink to={ROUTES.Profile} />
        <NavLink to={ROUTES.Logout} />
      </div>
    )
  }

  renderUnauthenticatedMenu() {
    return (
      <div>
        <NavLink to={ROUTES.SignUp} />
        <NavLink to={ROUTES.Login} />
      </div>
    )
  }
}

export default connect(
  (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    routing: state.routing, // required for <NavLink> components to work correctly
  }),
)(NavBar)
