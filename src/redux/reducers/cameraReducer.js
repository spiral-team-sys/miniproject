import { CLEAR_CAMERA_INFO, CLEAR_CAMERA_REPORT_INFO, SET_CAMERA_INFO, SET_CAMERA_REPORT_INFO } from "../types";

const initialState = {
    cameraInfo: {},
    cameraReportInfo: {}
};

const cameraReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CAMERA_INFO:
            return {
                ...state,
                cameraInfo: action.payload,
            };
        case CLEAR_CAMERA_INFO:
            return {
                ...state,
                cameraInfo: {},
            };
        case SET_CAMERA_REPORT_INFO:
            return {
                ...state,
                cameraReportInfo: action.payload,
            };
        case CLEAR_CAMERA_REPORT_INFO:
            return {
                ...state,
                cameraReportInfo: {},
            };
        default:
            return state;
    }
};

export default cameraReducer;
