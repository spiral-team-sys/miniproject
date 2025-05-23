import { CLEAR_MENU_HOME, CLEAR_MENU_REPORT, SET_MENU_HOME, SET_MENU_REPORT } from "../types";

const initialState = {
    menuHomeInfo: {},
    menuReportInfo: {},
};

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU_REPORT:
            return {
                ...state,
                menuReportInfo: action.payload,
            };
        case SET_MENU_HOME:
            return {
                ...state,
                menuHomeInfo: action.payload,
            };
        case CLEAR_MENU_REPORT:
            return {
                ...state,
                menuReportInfo: {},
            };
        case CLEAR_MENU_HOME:
            return {
                ...state,
                menuHomeInfo: {},
            };
        default:
            return state;
    }
};

export default menuReducer;
