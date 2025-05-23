import { CLEAR_STATUS_WORKING, SET_STATUS_WORKING } from "../types";

const initialState = {
    statusInfo: {},
};

const statusWorkingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATUS_WORKING:
            return {
                ...state,
                statusInfo: action.payload,
            };
        case CLEAR_STATUS_WORKING:
            return {
                ...state,
                statusInfo: {},
            };
        default:
            return state;
    }
};

export default statusWorkingReducer;
