import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Link from './Link';
import routes from 'routes';
import { topLevelMenu } from 'utils/menu';
import { authLogoutAndRedirect } from 'actions/auth';

class NavBar extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
    };

    logout = (e) => {
        e.preventDefault();
        this.props.authLogoutAndRedirect();
    };

    render() {
        return (
            <nav>
                <div className="container">
                    <div className="brand">
                        <Link to="/" onlyActiveOnIndex={true}>
                            <span className="company">flask</span>
                            <span className="tld">api</span>
                        </Link>
                    </div>
                    <div className="menu">
                        {topLevelMenu(routes, /* excludePaths= */ ['login', '*'])}
                        <div className="pull-right">
                            {this.props.isAuthenticated
                                ? <a href="#" onClick={this.logout}>Logout</a>
                                : <Link to="/login">Login</Link>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    routing: state.routing, // required for <Link> components to work correctly
});

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators({authLogoutAndRedirect}, dispatch)
)(NavBar);
