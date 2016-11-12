import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NavBar } from 'components/Nav';

import styles from 'main.scss';

export default class Application extends Component {
    render() {
        return (
            <div className="fixed-nav-top">
                <header>
                    <NavBar/>
                </header>
                <main>
                    {this.props.children}
                </main>
                <footer>
                    {/* Copyright {new Date().getFullYear()} Your Name */}
                </footer>
            </div>
        );
    }
}
