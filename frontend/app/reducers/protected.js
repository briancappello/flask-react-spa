import createReducer from './createReducer'

import {
    PROTECTED_REQUEST,
    PROTECTED_SUCCESS,
    PROTECTED_FAILURE,
} from 'actions/protected'

const initialState = {
    isLoaded: false,
    isLoading: false,
    data: null,
    error: null,
}

export default createReducer(initialState, {
    [PROTECTED_REQUEST]: (state, payload) => {
        return { ...initialState, isLoading: true }
    },
    [PROTECTED_SUCCESS]: (state, payload) => {
        return { ...initialState, isLoaded: true, data: payload }
    },
    [PROTECTED_FAILURE]: (state, payload) => {
        return { ...initialState, error: payload }
    },
})
