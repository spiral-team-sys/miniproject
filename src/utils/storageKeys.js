const THEME = {
    APP_THEME: 'apptheme'
}
const STORAGE = {
    USER_INFO: 'userinfo',
    TOKEN: 'token',
    PREFERENCES: 'preferences',
    LAST_VISIT_ROUTE: 'lastVisitRoute',
    TIME_SELECTED: 'timeSelected',
    SETTING_ONLY_WIFI: 'settingOnlyWifi',
    AUTO_DELETE_PHOTO: 'autoDeletePhoto'
}
const DEVICE_EVENT = {
    RECORD_START: 'recordstart',
    RECORD_STOP: 'recordstop',
    RELOAD_ATTENDANCE: 'reloadattendance',
    RELOAD_MODE: 'reloadattendanceMode',
    RELOAD_PHOTO_AUDIT: 'reloadPhotoAudit',
    RELOAD_PHOTO_REPORT: 'reloadPhotoReport',
    RELOAD_PHOTO_OVERVIEW: 'reloadPhotoOverview',
    RELOAD_DOING: 'reloadDoing',
    RELOAD_DOING_OVERVIEW: 'reloadDoingOverview',
    RELOAD_DOING_SIGNBOARD: 'reloadDoingSignboard',
    UDPATE_DATA_RAW_SURVEY: 'udpateDataRawSurvey',
    UDPATE_DATA_RAW_PHOTO: 'udpateDataRawPhoto',
    SHOW_SETTING_REPORT: 'setShowSettingReport',
    RELOAD_MENU_REPORT: 'reloadMenuReport',
    RELOAD_SHOP_BYPLAN: 'reloadShopByPlan',
    LOGOUT_STATUS: 'logOutStatus',
    POPUP_WEBVIEW: 'popupview',
    CHECK_VERSION: 'checkversion',
    NOTIFICATION_SHEET_DETAILS: 'notificationSheetDetails',
    RELOAD_SETTING: 'reloadSetting',
    LAST_UPLOAD_TIME_HEALTH: 'lastUploadTimeHealth',
    RELOAD_DATA_MERGE_ATTENDANCE: 'reloadDataMergeAttendance'
}
const ACTION_SHEET = {
    REASON_SHEET: 'reasonList',
    TIMESLOT_SHEET: 'timeSlotSheet',
    FILE_DELETE_SHEET: 'fileDeleteSheet',
    PASSWORD_SHEET: 'passwordSheet',
    CHECKED_SHEET: 'checkedsSheet',
    REASON_REPORT_PD_SHEET: 'reasonPDSheet',
    DOCUMENT_SHEET: 'documentSheet',
    VIDEO_SHEET: 'videoSheet',
    OPTION_SHEET: 'optionSheet',
    CARTYPE_SHEET: 'carTypeSheet',
    DATE_SHEET: 'dateSheet'
}
const ANSWER_TYPE = {
    AUDIO: "A",
    TEXT: "T",
    NUMBER: "N",
    FLOAT: "F",
    CHECKBOX: "C",
    BOOLEAN: "B",
    DATE: "D",
    QUANTITY_PRICE: "QP"
}
const SURVEY_MODE = {
    NEW: "NEW",
    FAILD: "FAIL",
}
const TTLKey = "TTL_APPLICATION"
//
export const KEYs = {
    THEME,
    STORAGE,
    DEVICE_EVENT,
    ACTION_SHEET,
    ANSWER_TYPE,
    SURVEY_MODE,
    TTLKey
}