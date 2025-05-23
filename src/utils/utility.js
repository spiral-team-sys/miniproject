import { Platform } from "react-native";
import { deviceWidth } from "../styles/styles";
import moment from "moment";

export const imageSize = { width: 1920, height: 1080 }
export const fontWeightBold = Platform.OS == 'android' ? '700' : '600'
export const keyboardVerticalOffset = Platform.OS == 'android' ? 44 : 8
export const paddingTopScreen = Platform.OS == 'ios' ? 48 : Platform.Version >= 35 ? 48 : 8
export const TODAY = { date: moment().format('YYYY-MM-DD'), integer: parseInt(moment().format('YYYYMMDD')) }
export const initialRegionDefault = { latitude: 10.78808751298806, longitude: 106.6992601038322, longitudeDelta: 0.05, latitudeDelta: 0.05 }
export const weekdays = [
    { dayOfWeek: 1, weekDayName: 'T2' },
    { dayOfWeek: 2, weekDayName: 'T3' },
    { dayOfWeek: 3, weekDayName: 'T4' },
    { dayOfWeek: 4, weekDayName: 'T5' },
    { dayOfWeek: 5, weekDayName: 'T6' },
    { dayOfWeek: 6, weekDayName: 'T7' },
    { dayOfWeek: 0, weekDayName: 'CN' }
];

export const minWidthTab = (data) => {
    return (data.length > 4) ? (deviceWidth / 5) : ((data.length > 0 && data.length < 5) ? (deviceWidth / data.length) : 0);
}
export const connectionTypeTranslate = (type) => {
    switch (type) {
        case 'wifi':
            return 'Wifi'
        case 'cellular':
            return 'Dữ liệu di động'
        case 'none':
            return 'Không có kết nối mạng'
        case 'unknown':
            return 'Kết nối không xác định'
    }
}
export const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};
export const UPLOAD_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
