import AsyncStorage from '@react-native-async-storage/async-storage';
//
export const PROJECT = "PRODJECTID";
export const imvApp = 'imv';
export const pmcApp = 'pmc';
export const daikinAuditApp = 'dksaudit';
export const heinekenMerApp = 'hmer';
export const bridgetoneApp = 'brs';
export const carlsbergApp = 'carlsberg';
export const massanApp = 'massan';
export const stiebelApp = 'sti';
export const hvnStockApp = 'stock';

let configByCode = {
    AppNameRun: 'nokey',
    APPNAME: 'Setting',
    BRANDNAME: 'Setting',
    URL_ROOT: 'https://adhoc-api.sucbat.com.vn/',
    PRIMARY_COLOR: '#2196F3',
    SECONDARY_COLOR: '#FFC107',
    TERTIARY_COLOR: '#0a72a0',
    ICON_TYPE: 'ionicon'
};
export const configureApp = async () => {
    const project = await AsyncStorage.getItem(PROJECT);
    if (project) {
        configByCode.AppNameRun = project;
        switch (project) {
            case imvApp:
                configByCode.APPNAME = 'IVMS';
                configByCode.BRANDNAME = 'IMV Sales';
                configByCode.URL_ROOT = 'https://imv-api.sucbat.com.vn/';
                break;
            case hvnStockApp:
                configByCode.APPNAME = 'Kiểm kho';
                configByCode.BRANDNAME = 'HVN';
                configByCode.URL_ROOT = 'https://hvnstock-api.sucbat.com.vn/';
                break;
            case daikinAuditApp:
                configByCode.APPNAME = 'DKS Audit';
                configByCode.BRANDNAME = 'Daikin Audit';
                configByCode.URL_ROOT = 'https://adhoc-api.sucbat.com.vn/';
                break;
            case heinekenMerApp:
                configByCode.APPNAME = 'Heineken Mer';
                configByCode.BRANDNAME = 'Heineken Mer';
                configByCode.URL_ROOT = 'https://merh-api.sucbat.com.vn/';
                break;
            case bridgetoneApp:
                configByCode.APPNAME = 'Spiral BRS';
                configByCode.BRANDNAME = 'Bridgetone Survey';
                configByCode.URL_ROOT = 'https://bridgestone.sucbat.com.vn/';
                break;
            case carlsbergApp:
                configByCode.APPNAME = 'carlsberg';
                configByCode.BRANDNAME = 'Carlsberg POP';
                configByCode.URL_ROOT = 'https://cbp-api.sucbat.com.vn/';
                break;
            case massanApp:
                configByCode.APPNAME = 'Massan';
                configByCode.BRANDNAME = 'Massan';
                configByCode.URL_ROOT = 'https://mss-api.sucbat.com.vn/';
                break;
            case stiebelApp:
                configByCode.APPNAME = 'Stiebel Eltron';
                configByCode.BRANDNAME = 'Stiebel Eltron';
                configByCode.URL_ROOT = 'https://stiebel-api.sucbat.com.vn/';
                break;
            default:
                configByCode.APPNAME = 'Adhoc Setting';
                configByCode.BRANDNAME = 'Cài đặt';
                configByCode.URL_ROOT = 'https://adhoc-api.sucbat.com.vn/';
                break;
        }
    }
    return { ...configByCode, APPID: project };;
};
export default configByCode;
