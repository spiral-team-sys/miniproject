import { SET_USER_INFO, CLEAR_USER_INFO } from '../types';

const initialState = {
    userInfo: {},
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.payload,
            };
        case CLEAR_USER_INFO:
            return {
                ...state,
                userInfo: {},
            };
        default:
            return state;
    }
};

export default userReducer;
