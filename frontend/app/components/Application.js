import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'

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
import { NavBar } from 'components/Nav'
import { SITE_NAME, COPYRIGHT } from 'config'
import { AnonymousRoute, ProtectedRoute } from 'utils/route'

import 'main.scss'


export default (props) => (
  <div className="fixed-nav-top">
    <Helmet titleTemplate={`%s - ${SITE_NAME}`}
            defaultTitle={SITE_NAME}
    />
    <header>
      <NavBar />
    </header>
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/styles" component={Styles} />
        <ProtectedRoute exact path="/protected" component={Protected} />

        <AnonymousRoute exact path="/sign-up" component={SignUp} />
        <AnonymousRoute exact path="/sign-up/resend-confirmation-email" component={ResendConfirmation} />
        <AnonymousRoute exact path="/sign-up/pending-confirm-email" component={PendingConfirmation} />

        <AnonymousRoute exact path="/login" component={Login} />
        <AnonymousRoute exact path="/login/forgot-password" component={ForgotPassword} />
        <AnonymousRoute exact path="/login/reset-password/:token" component={ResetPassword} />

        <ProtectedRoute exact path="/profile" component={Profile} />
        <Route exact path="/logout" component={Logout} />

        {/* default 404 if no match */}
        <Route component={NotFound} />
      </Switch>
    </main>
    <footer className="center">
       Copyright {new Date().getFullYear()} {COPYRIGHT}
    </footer>
  </div>
)
