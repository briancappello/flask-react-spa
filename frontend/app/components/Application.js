import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { SITE_NAME, COPYRIGHT } from 'config'
import { NavBar } from 'components/Nav'

import 'main.scss'

export default class Application extends Component {
  render() {
    return (
      <div className="fixed-nav-top">
        <Helmet titleTemplate={`%s - ${SITE_NAME}`}
                defaultTitle={SITE_NAME}
        />
        <header>
          <NavBar />
        </header>
        <main>
          {this.props.children}
        </main>
        <footer className="center">
           Copyright {new Date().getFullYear()} {COPYRIGHT}
        </footer>
      </div>
    )
  }
}
