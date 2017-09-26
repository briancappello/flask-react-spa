import React from 'react'
import { NavLink } from 'react-router-dom'
import isFunction from 'lodash/isFunction'

import { ROUTE_MAP } from 'routes'


export default class LoadableNavLink extends React.Component {
  maybePreloadComponent = () => {
    const { Component } = ROUTE_MAP[this.props.to]
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
        {children || ROUTE_MAP[to].label}
      </NavLink>
    )
  }
}
