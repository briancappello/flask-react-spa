import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import getUTCTimestamp from 'utils';

export function validateToken(token) {
    try {
        return jwtDecode(token).exp < getUTCTimestamp();
    } catch (e) {
        return false;
    }
}

export default function requireAuthentication(Component) {
    class AuthenticatedComponent extends React.Component {

        static propTypes = {
            isAuthenticated: React.PropTypes.bool.isRequired,
            location: React.PropTypes.object.isRequired,
            dispatch: React.PropTypes.func.isRequired
        };

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            if (!this.props.isAuthenticated) {
                const redirectAfterLogin = this.props.location.pathname;
                this.props.dispatch(push(`/login?next=${redirectAfterLogin}`));
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            );
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthenticated: state.auth.isAuthenticated,
            token: state.auth.token
        };
    };

    return connect(mapStateToProps)(AuthenticatedComponent);
}
