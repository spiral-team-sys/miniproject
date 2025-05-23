import {
    SET_USER_INFO, CLEAR_USER_INFO,
    SET_SHOP_INFO, CLEAR_SHOP_INFO,
    SET_AUDIO_INFO, CLEAR_AUDIO_INFO,
    SET_MENU_REPORT, CLEAR_MENU_REPORT,
    SET_LOCATION_INFO, CLEAR_LOCATION_INFO,
    SET_CAMERA_INFO, CLEAR_CAMERA_INFO,
    SET_STATUS_WORKING,
    CLEAR_STATUS_WORKING,
    SET_MENU_HOME,
    CLEAR_MENU_HOME,
    CLEAR_CAMERA_REPORT_INFO,
    SET_CAMERA_REPORT_INFO,
    SET_PROJECT_ID,
    CLEAR_PROJECT_ID
} from '../types';

// user
export const setUserInfo = (userInfo) => ({ type: SET_USER_INFO, payload: userInfo });
export const clearUserInfo = () => ({ type: CLEAR_USER_INFO });
// shop
export const setShopInfo = (shopInfo) => ({ type: SET_SHOP_INFO, payload: shopInfo });
export const clearShopInfo = () => ({ type: CLEAR_SHOP_INFO });
// audio
export const setAudioInfo = (audioInfo) => ({ type: SET_AUDIO_INFO, payload: audioInfo });
export const clearAudioInfo = () => ({ type: CLEAR_AUDIO_INFO });
// menuReport
export const setMenuReport = (menuReportInfo) => ({ type: SET_MENU_REPORT, payload: menuReportInfo });
export const clearMenuReport = () => ({ type: CLEAR_MENU_REPORT });
// menuHome
export const setMenuHome = (menuHomeInfo) => ({ type: SET_MENU_HOME, payload: menuHomeInfo });
export const clearMenuHome = () => ({ type: CLEAR_MENU_HOME });
// location
export const setLocationInfo = (info) => ({ type: SET_LOCATION_INFO, payload: info });
export const clearLocationInfo = () => ({ type: CLEAR_LOCATION_INFO });
// camera
export const setCameraInfo = (info) => ({ type: SET_CAMERA_INFO, payload: info });
export const setCameraReportInfo = (info) => ({ type: SET_CAMERA_REPORT_INFO, payload: info });
export const clearCameraInfo = () => ({ type: CLEAR_CAMERA_INFO });
export const clearCameraReportInfo = () => ({ type: CLEAR_CAMERA_REPORT_INFO });
// statusWorking
export const setStatusWorking = (info) => ({ type: SET_STATUS_WORKING, payload: info });
export const clearStatusWorking = () => ({ type: CLEAR_STATUS_WORKING });
// project
export const setProjectId = (id) => ({ type: SET_PROJECT_ID, payload: id });
export const clearProjectId = () => ({ type: CLEAR_PROJECT_ID }); 
