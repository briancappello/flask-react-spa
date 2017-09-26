import React from 'react'
import { Route, Switch } from 'react-router-dom'
import startCase from 'lodash/startCase'

import * as pageComponents from 'components/Pages'
import { NotFound } from 'components/Pages'
import { AnonymousRoute, ProtectedRoute } from 'utils/route'


/**
 * ROUTES: The canonical store of frontend URL paths
 *
 * Keys are Component class names by convention
 * Values are URL paths (in React Router path notation)
 */
export const ROUTES = {
  // ComponentName: path
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
 * keys: ComponentName
 * values: Object with possible keys of:
 *  - label: string, label to use for links (default: startCase(ComponentName))
 *  - Component: The component to use (default: pageComponents[ComponentName])
 *  - RouteComponent: AnonymousRoute, ProtectedRoute or Route (default)
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
  ROUTE_MAP[path] = {
    name: componentName,
    label: routeDetails && routeDetails.label || startCase(componentName),
    Component: routeDetails && routeDetails.Component || pageComponents[componentName],
    RouteComponent: routeDetails && routeDetails.RouteComponent || Route,
  }
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

export const Routes = () => (
  <Switch>
    {cachedRoutes}
  </Switch>
)
export default Routes
