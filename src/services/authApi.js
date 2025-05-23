import { post } from './apiManager';
import { KEYs } from '../utils/storageKeys';
import { initializeDeviceInfo } from '../utils/globals';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig, { brsApp, eoeApp } from '../utils/appConfig/appConfig';
//
const pathLogin = () => {
    switch (appConfig.APPID) {
        case eoeApp:
            return 'users/loginapp';
        case brsApp:
            return 'api/users/login';
        default:
            return 'users/login'
    }
}

const login = async (data) => {
    try {
        const response = await post(pathLogin(), data);
        if (response.token !== undefined) {
            // EOE Only 
            return { statusId: response.id > 0 ? 200 : 500, messager: response?.error, data: [{ ...response, menuList: null, menuActive: null, permission: null }] };
        }
        return response
    } catch (error) {
        return console.log(error)
    }
};
const logout = async () => {
    try {
        await AsyncStorage.removeItem(KEYs.STORAGE.USER_INFO);
        return true;
    } catch (error) {
        return null;
    }
};
const devicelog = async () => {
    try {
        const deviceInfo = await initializeDeviceInfo()
        const uniqueId = await DeviceInfo.getUniqueId()
        const data = {
            "deviceInfo": JSON.stringify(deviceInfo),
            "deviceId": uniqueId,
            "platform": Platform.OS.toString()
        }
        await post('download/deviceInfo', JSON.stringify(data))
    } catch (e) {
        console.log("PostDeviceInfo Error: ", e)
    }
};
export const AUTH_API = { login, logout, devicelog }