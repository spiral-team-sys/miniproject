import { CLEAR_AUDIO_INFO, SET_AUDIO_INFO } from "../types";

const initialState = {
    audioInfo: {},
};

const audioReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUDIO_INFO:
            return {
                ...state,
                audioInfo: action.payload,
            };
        case CLEAR_AUDIO_INFO:
            return {
                ...state,
                audioInfo: {},
            };
        default:
            return state;
    }
};

export default audioReducer;
