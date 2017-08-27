import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { authLoginUser } from 'actions/auth';
import { flashInfo, flashDanger } from 'actions/flash';

import { PageContent } from 'components/Content';

class Login extends React.Component {
    static propTypes = {
        isAuthenticated: React.PropTypes.bool.isRequired,
        isAuthenticating: React.PropTypes.bool.isRequired,
        statusText: React.PropTypes.string,

        push: React.PropTypes.func.isRequired,
        authLoginUser: React.PropTypes.func.isRequired,
        flashInfo: React.PropTypes.func.isRequired,
        flashDanger: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const { location } = this.props;

        this.state = {
            email: '',
            password: '',
            redirectTo: location ? location.query.next || '/' : '/',
        };
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.push('/');
            this.props.flashInfo('You are already logged in.');
        }
    }

    login = (e) => {
        e.preventDefault();
        const { email, password, redirectTo } = this.state;
        this.props.authLoginUser(email, password, redirectTo);
    };

    handleInputChange = (e, field) => {
        this.setState({
            [field]: e.target.value
        });
    };

    componentWillReceiveProps(nextProps) {
        const { statusText, flashDanger } = nextProps;
        if (statusText) {
            flashDanger(statusText, null);
        }
    }

    render() {
        return (
            <PageContent>
                <div className="row">
                    <h1>Log in!</h1>
                    <p>Hint: a@a.com / pw</p>
                    <form>
                        <input type="text"
                               placeholder="Username"
                               onChange={(e) => { this.handleInputChange(e, 'email'); }}
                        />
                        <input type="password"
                               placeholder="Password"
                               onChange={(e) => { this.handleInputChange(e, 'password'); }}
                        />
                        <button type="submit"
                                className="btn btn-primary"
                                disabled={this.props.isAuthenticating}
                                onClick={this.login}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </PageContent>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators({ authLoginUser, flashInfo, flashDanger, push }, dispatch)
)(Login);
