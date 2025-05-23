import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, onMessage, onTokenRefresh, requestPermission, onBackgroundMessage } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { toastInfo } from './configToast';

const messaging = getMessaging(getApp());

const requestFCMPermission = async () => {
    try {
        const permission = await requestPermission(messaging);
        if (!permission) {
            toastInfo('Thông báo', 'Quyền truy cập thông báo của thiết bị bị chặn, Vui lòng kiểm tra lại trong cài đặt');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
};

const getFCMToken = async () => {
    try {
        const token = await getToken(messaging);
        return token;
    } catch (error) {
        console.error('Error fetching FCM token:', error);
    }
};

const onMessageReceived = (callback) => {
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
        if (callback) callback(remoteMessage);
    });
    return unsubscribe;
};

const onNotificationOpened = () => {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('App opened from background');
        }
    });
};

const onTokenRefreshHandler = () => {
    onTokenRefresh(messaging, (newToken) => {
        console.log('FCM Token refreshed:', newToken);
    });
};

const initializeFirebaseMessaging = async () => {
    if (Platform.OS === 'ios') {
        await requestFCMPermission();
    }
    onNotificationOpened();
    onTokenRefreshHandler();
};

export const FIREBASE = { initializeFirebaseMessaging, onMessageReceived, getFCMToken, requestFCMPermission };