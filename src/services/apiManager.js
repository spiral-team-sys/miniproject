import axios from 'axios';
import appConfig from '../utils/appConfig/appConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastError } from '../utils/configToast';
import { KEYs } from '../utils/storageKeys';
import { DeviceEventEmitter } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
// Cấu hình axios với URL mặc định
const api = axios.create({
    baseURL: appConfig.URL_ROOT,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => { return response },
    (error) => {
        console.log('Lỗi API: ', error);
        let errorMessage;
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Yêu cầu mất quá nhiều thời gian, vui lòng thử lại sau.';
        } else if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu.';
                    break;
                case 401:
                    errorMessage = 'Không có quyền truy cập! Có thể tài khoản của bạn đã hết hạn đăng nhập, vui lòng đăng nhập lại!'
                    DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.LOGOUT_STATUS, errorMessage)
                    break
                case 403:
                    errorMessage = 'Bạn không có quyền truy cập vào tài nguyên này.';
                    break;
                case 404:
                    errorMessage = 'Tài nguyên không tồn tại. Vui lòng kiểm tra lại URL.';
                    break;
                case 500:
                    errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
                    break
                case 503:
                    errorMessage = 'Không có kết nối mạng!';
                    break;
                default:
                    errorMessage = `Có lỗi xảy ra: ${error.response.status} - ${error.message}`;
            }
        } else {
            errorMessage = 'Lỗi không xác định. Vui lòng thử lại sau.';
        }
        return Promise.reject(errorMessage);
    }
);
//
export const get = async (endpoint, params = {}) => {
    try {
        const isConnected = await checkConnectionAPI()
        if (isConnected) {
            // await console.log(endpoint)
            const response = await api.get(endpoint, { headers: params });
            // await console.log(response, endpoint)
            // await console.log(api.head(), endpoint)
            if (response.status === 200)
                return response.data;
            else
                toastError('Lỗi kết nối', `Status ${response.statusText}`);
        } else {
            toastError('Kết nối mạng', `GET: Kết nối mạng không ổn định, Vui lòng kiểm tra và thử lại.`);
        }
        return [];
    } catch (error) {
        toastError('Lỗi kết nối', `GET-Error: ${error} ${endpoint}`);
        return []
    }
};
export const getMultiple = async (endpoints = []) => {
    try {
        const isConnected = await checkConnectionAPI()
        if (isConnected) {
            const responses = await axios.all(endpoints.map((endpoint) => api.get(endpoint)));
            return responses.map((response) => response.data);
        } else {
            toastError('Kết nối mạng', `GET: Kết nối mạng không ổn định, Vui lòng kiểm tra và thử lại.`);
        }
    } catch (error) {
        toastError('Lỗi đồng bộ dữ liệu', `GET-Multiple: ${error}`);
        return [];
    }
};
export const post = async (endpoint, data = {}, params = {}) => {
    try {
        const isConnected = await checkConnectionAPI()
        if (!isConnected) {
            return {
                "data": null,
                "messeger": 'Kết nối mạng không ổn định, Vui lòng kiểm tra và thử lại',
                "statusId": 503,
            }
        }
        //
        const response = await api.post(endpoint, data, { headers: params });
        // console.log(response, "response")
        if (response.status === 200)
            return response.data
        else
            return {
                "data": null,
                "messeger": response.statusText,
                "statusId": response.status,
            }
    } catch (error) {
        return {
            "data": null,
            "messeger": error,
            "statusId": 404,
        }
    } finally {
    }
};
//
export const getToken = async () => {
    try {
        const userinfo = JSON.parse(await AsyncStorage.getItem(KEYs.STORAGE.USER_INFO));
        return `Bearer ${userinfo.token}`;
    } catch (error) {
        return null;
    }
};
const checkConnectionAPI = async () => {
    try {
        const { isConnected, isInternetReachable } = await NetInfo.fetch();
        if (!isConnected || !isInternetReachable) {
            return false
        }
        const response = await api.get(`public/connectionInfo`);
        return response.status == 200
    } catch {
        return false
    }
};