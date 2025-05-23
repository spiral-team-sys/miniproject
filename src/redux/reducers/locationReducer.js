import { CLEAR_LOCATION_INFO, SET_LOCATION_INFO } from "../types";

const initialState = {
    locationInfo: {},
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCATION_INFO:
            return {
                ...state,
                locationInfo: action.payload,
            };
        case CLEAR_LOCATION_INFO:
            return {
                ...state,
                locationInfo: {},
            };
        default:
            return state;
    }
};

export default locationReducer;
