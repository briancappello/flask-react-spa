import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import authReducer, { initialState as authState } from './auth';
import flashReducer, { initialState as flashState } from './flash';

export const initialState = {
    auth: authState,
    flash: flashState,
};

const rootReducer = combineReducers({
    auth: authReducer,
    flash: flashReducer,

    routing: routerReducer,
    form: formReducer,
});

export default rootReducer;
