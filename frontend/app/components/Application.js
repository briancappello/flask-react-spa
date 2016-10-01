import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NavBar } from 'components/Nav';
import Flash from 'components/Flash/Flash';

import styles from 'main.scss';

export default class Application extends Component {
    render() {
        return (
            <div className="application">
                <NavBar/>
                <div className="content">
                    <Flash/>
                    {this.props.children}
                </div>
                {/* FIXME: site footer component */}
            </div>
        );
    }
}
