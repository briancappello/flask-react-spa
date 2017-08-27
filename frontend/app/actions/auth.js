import fetch from 'isomorphic-fetch';
import * as Cookies from 'js-cookie';
import { push } from 'react-router-redux';

import { SERVER_URL } from 'config';
import { checkHttpStatus, parseJSON } from 'utils/api';
import { flashSuccess, flashDanger } from 'actions/flash';

export const AUTH_LOGIN_USER_REQUEST = 'AUTH_LOGIN_USER_REQUEST';
export const AUTH_LOGIN_USER_SUCCESS = 'AUTH_LOGIN_USER_SUCCESS';
export const AUTH_LOGIN_USER_FAILURE = 'AUTH_LOGIN_USER_FAILURE';

export const AUTH_LOGOUT_USER_REQUEST = 'AUTH_LOGOUT_USER_REQUEST';
export const AUTH_LOGOUT_USER_SUCCESS = 'AUTH_LOGOUT_USER_SUCCESS';
export const AUTH_LOGOUT_USER_FAILURE = 'AUTH_LOGOUT_USER_FAILURE';

// FIXME: sessionStorage vs localStorage

export function authLoginUserSuccess(token, user) {
    localStorage.setItem('token', token);
    return {
        type: AUTH_LOGIN_USER_SUCCESS,
        payload: {
            token,
            user,
        }
    };
}

export function authLoginUserFailure(error) {
    localStorage.removeItem('token');
    return {
        type: AUTH_LOGIN_USER_FAILURE,
        payload: error,
    };
}

export function authLoginUserRequest() {
    return {
        type: AUTH_LOGIN_USER_REQUEST
    };
}

export function authLoginUser(email, password, redirect='/') {
    return (dispatch) => {
        dispatch(authLoginUserRequest());
        return fetch(`${SERVER_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrf_token'),
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                const { token, user } = response;
                try {
                    dispatch(authLoginUserSuccess(token, user));
                    dispatch(push(redirect));
                    dispatch(flashSuccess('You have been successfully logged in.'));
                } catch (e) {
                    dispatch(authLoginUserFailure({
                        statusCode: 403,
                        error: process.env.NODE_ENV === 'production' ? 'Invalid token' : e,
                    }));
                }
            })
            // invalid HTTP status
            .catch(error => {
                let { status, statusText } = error.response;

                // attempt to parse error details from response body
                Promise.resolve(error.response)
                    .then(parseJSON)
                    .then(body => {
                        dispatch(authLoginUserFailure({
                            statusCode: status,
                            error: body.error,
                        }));
                    })
                    // otherwise return generic error
                    .catch(_ => {
                        dispatch(authLoginUserFailure({
                            statusCode: status,
                            error: statusText,
                        }));
                    });
            });
    };
}

function authLogoutUserRequest() {
    return {
        type: AUTH_LOGOUT_USER_REQUEST,
    }
}

export function authLogoutUserSuccess() {
    localStorage.removeItem('token');
    return {
        type: AUTH_LOGOUT_USER_SUCCESS,
    }
}

function authLogoutUserFailure() {
    localStorage.removeItem('token');
    return {
        type: AUTH_LOGOUT_USER_FAILURE,
    }
}

export function authLogoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(authLogoutUserRequest());
        return fetch(`${SERVER_URL}/auth/logout`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(authLogoutUserSuccess())
                dispatch(push('/'))
                dispatch(flashSuccess('You have been successfully logged out.'))
            })
            // invalid HTTP status
            .catch(error => {
                dispatch(authLogoutUserFailure())
            })
    }
}
