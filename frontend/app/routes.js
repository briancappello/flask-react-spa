import React from 'react'
import { Route, Switch } from 'react-router-dom'
import startCase from 'lodash/startCase'

import * as pages from 'pages'
import { NotFound } from 'pages'
import { AnonymousRoute, ProtectedRoute } from 'utils/route'


/**
 * ROUTES: The canonical store of frontend URL paths
 *
 * Keys are Component class names by convention
 * Values are URL paths (in React Router path notation)
 */
export const ROUTES = {
  Home: '/',
  About: '/about',
  Styles: '/styles',
  Contact: '/contact',
  SignUp: '/sign-up',
  ResendConfirmation: '/sign-up/resend-confirmation-email',
  PendingConfirmation: '/sign-up/pending-confirm-email',
  Login: '/login',
  Logout: '/logout',
  ForgotPassword: '/login/forgot-password',
  ResetPassword: '/login/reset-password/:token',
  Profile: '/profile',
}

/**
 * extra route details
 *
 * keys: path
 * values: Object with possible keys of:
 *  - label: string, label to use for links (default: startCase(ComponentName))
 *  - Component: The component to use (default: pages[ComponentName])
 *  - RouteComponent: AnonymousRoute, ProtectedRoute or Route (default: Route)
 */
const extraRouteDetails = {
  [ROUTES.SignUp]: { RouteComponent: AnonymousRoute },
  [ROUTES.ResendConfirmation]: { RouteComponent: AnonymousRoute },
  [ROUTES.PendingConfirmation]: { RouteComponent: AnonymousRoute },
  [ROUTES.Login]: { RouteComponent: AnonymousRoute },
  [ROUTES.ForgotPassword]: {
    label: 'Forgot password?',
    RouteComponent: AnonymousRoute,
  },
  [ROUTES.ResetPassword]: { RouteComponent: AnonymousRoute },
  [ROUTES.Profile]: { RouteComponent: ProtectedRoute },
}

export const ROUTE_MAP = {}
Object.keys(ROUTES).forEach((componentName) => {
  const path = ROUTES[componentName]
  const routeDetails = extraRouteDetails[path]
  const route = {
    name: componentName,
    label: routeDetails && routeDetails.label || startCase(componentName),
    Component: routeDetails && routeDetails.Component || pages[componentName],
    RouteComponent: routeDetails && routeDetails.RouteComponent || Route,
  }
  if (!route.Component) {
    throw new Error(`Could not find component named ${componentName} for ${path}`)
  }
  ROUTE_MAP[path] = route
})

/**
 * We use objects to store route details because more often than not we need to
 * look up routes by path (eg linking to components and/or rendering NavLinks).
 *
 * However, React Router 4 re-renders all child components of Switch statements
 * on every page change. And since constantly iterating over an object's keys
 * isn't ideal, we render the routes once ahead of time here.
 */
const cachedRoutes = Object.keys(ROUTE_MAP).map((path) => {
  const { RouteComponent, Component } = ROUTE_MAP[path]
  return <RouteComponent exact path={path} component={Component} key={path} />
})
cachedRoutes.push(<Route component={NotFound} key="*" />)

export default () => (
  <Switch>
    {cachedRoutes}
  </Switch>
)
