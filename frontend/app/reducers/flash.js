import createReducer from './createReducer';

import {
    FLASH_SUCCESS,
    FLASH_INFO,
    FLASH_WARNING,
    FLASH_DANGER,
    FLASH_CLEAR,
} from 'actions/flash';


export const initialState = {
    title: null,
    message: null,
    severity: null,
    visible: false,
};

export default createReducer(initialState, {
    [FLASH_SUCCESS]: (state, payload) => {
        return {
            ...payload,
            visible: true,
            severity: 'success',
        };
    },
    [FLASH_INFO]: (state, payload) => {
        return {
            ...payload,
            visible: true,
            severity: 'info',
        };
    },
    [FLASH_WARNING]: (state, payload) => {
        return {
            ...payload,
            visible: true,
            severity: 'warning',
        };
    },
    [FLASH_DANGER]: (state, payload) => {
        return {
            ...payload,
            visible: true,
            severity: 'danger',
        };
    },
    [FLASH_CLEAR]: (state, payload) => {
        return initialState;
    },
});
