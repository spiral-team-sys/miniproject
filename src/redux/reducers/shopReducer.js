import { CLEAR_SHOP_INFO, SET_SHOP_INFO } from "../types";

const initialState = {
    shopInfo: {},
};

const shopReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SHOP_INFO:
            return {
                ...state,
                shopInfo: action.payload,
            };
        case CLEAR_SHOP_INFO:
            return {
                ...state,
                shopInfo: {},
            };
        default:
            return state;
    }
};

export default shopReducer;
