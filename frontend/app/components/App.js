import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'

import {
  About,
  Contact,
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
} from 'components/Pages'

import { NavBar } from 'components'
import { SITE_NAME, COPYRIGHT } from 'config'
import { AnonymousRoute, ProtectedRoute } from 'utils'

import 'main.scss'


const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/styles" component={Styles} />
    <Route exact path="/contact" component={Contact} />

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
)

const AppLayout = () => (
  <div className="fixed-nav-top">
    <Helmet titleTemplate={`%s - ${SITE_NAME}`}
            defaultTitle={SITE_NAME}
    />
    <header>
      <NavBar />
    </header>
    <main>
      <Routes />
    </main>
    <footer className="center">
       Copyright {new Date().getFullYear()} {COPYRIGHT}
    </footer>
  </div>
)

export default (props) => (
  <Provider store={props.store}>
    <ConnectedRouter history={props.history}>
      <AppLayout />
    </ConnectedRouter>
  </Provider>
)
