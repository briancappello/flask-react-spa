import fetch from 'isomorphic-fetch'

import { SERVER_URL } from 'config'
import { checkHttpStatus, parseJSON } from 'utils/api'

export const PROTECTED_REQUEST = 'PROTECTED_REQUEST'
export const PROTECTED_SUCCESS = 'PROTECTED_SUCCESS'
export const PROTECTED_FAILURE = 'PROTECTED_FAILURE'

function protectedRequest() {
    return {
        type: PROTECTED_REQUEST,
    }
}

function protectedSuccess(data) {
    return {
        type: PROTECTED_SUCCESS,
        payload: data,
    }
}

function protectedFailure(error) {
    return {
        type: PROTECTED_FAILURE,
        payload: error,
    }
}

function fetchProtected() {
    return dispatch => {
        dispatch(protectedRequest())
        return fetch(`${SERVER_URL}/api/v1/test`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(protectedSuccess(response))
            })
            .catch(error => {
                dispatch(protectedFailure(error))
            })
    }
}

function shouldFetchProtected(state) {
    const { isLoaded, isLoading } = state.protected;
    if (isLoaded || isLoading) {
        return false
    } else {
        return true
    }
}

export function fetchProtectedIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchProtected(getState())) {
            return dispatch(fetchProtected())
        }
    }
}
