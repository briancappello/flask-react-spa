import React, { Component } from 'react';

export default class PageContent extends Component {
    static defaultProps = {
        className: '',
    };

    render() {
        return (
            <div className="container">
                <div className={`${this.props.className} content`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
