import React, { Component } from 'react';
import { Link as BasicLink } from 'react-router';

export default class Link extends Component {
    render() {
        return <BasicLink {...this.props} activeClassName="active"/>
    }
}
