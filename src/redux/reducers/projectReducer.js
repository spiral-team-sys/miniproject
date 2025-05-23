import { CLEAR_PROJECT_ID, SET_PROJECT_ID } from "../types";

const initialState = {
    projectId: 0,
};

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROJECT_ID:
            return {
                ...state,
                projectId: action.payload,
            };
        case CLEAR_PROJECT_ID:
            return {
                ...state,
                projectId: 0,
            };
        default:
            return state;
    }
};

export default projectReducer;
