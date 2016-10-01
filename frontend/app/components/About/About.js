import React, { Component } from 'react';

import { PageContent } from 'components/Content';

export default class About extends Component {
    render() {
        const { children } = this.props;
        return  children ? children : (
            <PageContent>
                <h1>About!</h1>
            </PageContent>
        );
    }
}
