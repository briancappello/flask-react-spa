import jwtDecode from 'jwt-decode';
import createReducer from './createReducer';

import {
    AUTH_LOGIN_USER_REQUEST,
    AUTH_LOGIN_USER_SUCCESS,
    AUTH_LOGIN_USER_FAILURE,
    AUTH_LOGOUT_USER
} from 'actions/auth';


const initialState = {
    token: null,
    username: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null
};

export default createReducer(initialState, {
    [AUTH_LOGIN_USER_REQUEST]: (state, payload) => {
        return {
            ...initialState,
            isAuthenticating: true,
        };
    },
    [AUTH_LOGIN_USER_SUCCESS]: (state, payload) => {
        return {
            ...initialState,
            isAuthenticated: true,
            token: payload.token,
            username: jwtDecode(payload.token).username,
        };
    },
    [AUTH_LOGIN_USER_FAILURE]: (state, payload) => {
        return {
            ...initialState,
            statusText: `Authentication Error (${payload.statusCode}): ${payload.error}`,
        };
    },
    [AUTH_LOGOUT_USER]: (state, payload) => {
        return initialState;
    },
});
