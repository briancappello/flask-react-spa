import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ProtectedRoute from 'utils/auth'

import {
  About,
  ForgotPassword,
  Home,
  Login,
  Logout,
  NotFound,
  PendingConfirmation,
  ResendConfirmation,
  ResetPassword,
  SignUp,
  Styles,
  Profile,
  Protected,
} from 'components'

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/styles" component={Styles} />
    <ProtectedRoute exact path="/protected" component={Protected} />

    <Route exact path="/sign-up" component={SignUp} />
    <Route exact path="/sign-up/resend-confirmation-email" component={ResendConfirmation} />
    <Route exact path="/sign-up/pending-confirm-email" component={PendingConfirmation} />

    <Route exact path="/login" component={Login} />
    <Route exact path="/login/forgot-password" component={ForgotPassword} />
    <Route exact path="/login/reset-password/:token" component={ResetPassword} />

    <ProtectedRoute exact path="/profile" component={Profile} />
    <Route exact path="/logout" component={Logout} />

    {/* default 404 if no match */}
    <Route component={NotFound} />
  </Switch>
)
