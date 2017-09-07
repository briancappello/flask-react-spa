import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import { NavBar } from 'components/Nav'
import Routes from 'routes'

import 'main.scss'

export default class Application extends Component {
  render() {
    return (
      <div className="fixed-nav-top">
        <header>
          <NavBar />
        </header>
        <main>
          <Routes />
        </main>
        <footer>
          {/* Copyright {new Date().getFullYear()} Your Name */}
        </footer>
      </div>
    )
  }
}
