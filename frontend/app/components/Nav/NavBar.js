import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { ROUTES } from 'routes'
import NavLink from './NavLink'

import './navbar.scss'


class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  componentWillReceiveProps() {
    this.setState({ menuOpen: false })
  }

  render() {
    const { isAuthenticated } = this.props
    const { menuOpen } = this.state

    return (
      <nav className={classnames({ 'menu-open': menuOpen })}>
        <div className="container navbar-top">
          <NavLink exact to={ROUTES.Home} className="brand">
            FlaskReact.<span className="tld">SPA</span>
          </NavLink>
          <a href="javascript:void(0);"
             className="burger"
             onClick={this.toggleResponsiveMenu}
          >
            Menu&nbsp;&nbsp;&#9776;
          </a>
          <div className="menu left">
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

  toggleResponsiveMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
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
