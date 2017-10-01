import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'

import { ROUTE_MAP } from 'routes'


export default class LoadableNavLink extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string,
        state: PropTypes.object,
      }),
    ]),
  }

  constructor(props) {
    super(props)

    const { to } = props
    if (isString(to)) {
      this.pathname = to
    } else {
      this.pathname = to.pathname
    }
  }

  maybePreloadComponent = () => {
    const route = ROUTE_MAP[this.pathname]
    if (!route) {
      return
    }

    const { Component } = route
    if (isFunction(Component.preload)) {
      Component.preload()
    }
  }

  render() {
    const { to, children, ...props } = this.props
    return (
      <NavLink to={to}
               activeClassName="active"
               onMouseOver={this.maybePreloadComponent}
               {...props}
      >
        {children || ROUTE_MAP[this.pathname].label}
      </NavLink>
    )
  }
}
