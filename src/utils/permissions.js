import { check, request, PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions';
import { Platform, Linking } from 'react-native';
import { toastError } from './configToast';
import { messageConfirm } from './helper';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const checkAndRequestPermission = async (permissionType) => {
    try {
        const result = await check(permissionType);
        const permissionName = getPermissionName(permissionType)
        return handlePermissionResult(result, permissionType, permissionName);
    } catch (error) {
        console.error('Lỗi kiểm tra quyền ứng dụng:', error);
        return false;
    }
}
export const checkMultiplePermission = async (permissions = []) => {
    try {
        let statusResult = true
        await requestMultiple(permissions).then((result) => {
            const permission_camera = result[CAMERA_PERMISSION]
            const permission_microphone = result[MICROPHONE_PERMISSION]
            const permission_location = result[LOCATION_PERMISSION]
            const permission_storage = result[STORAGE_PERMISSION]
            //
            if (permission_camera !== RESULTS.GRANTED) {
                handlePermissionResult(permission_camera, CAMERA_PERMISSION, 'Máy ảnh')
                statusResult = false
            }
            if (permission_microphone !== RESULTS.GRANTED) {
                handlePermissionResult(permission_microphone, MICROPHONE_PERMISSION, 'Microphone')
                statusResult = false
            }
            if (permission_location !== RESULTS.GRANTED) {
                handlePermissionResult(permission_location, LOCATION_PERMISSION, 'Vị trí')
                statusResult = false
            }
            if (Platform.OS == 'android' && Platform.Version < 33) {
                if (permission_storage !== RESULTS.GRANTED) {
                    handlePermissionResult(permission_storage, STORAGE_PERMISSION, 'Bộ nhớ')
                    statusResult = false
                }
            }
        })
        return statusResult
    } catch (e) {
        return false
    }
}
export const checkNotifeePermission = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus === AuthorizationStatus.DENIED || settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
        await notifee.requestPermission({
            announcement: true,
            sound: true,
            criticalAlert: true,
        });
    }
}
const handlePermissionResult = async (result, permissionType, permissionName = '') => {
    switch (result) {
        case RESULTS.UNAVAILABLE:
            toastError(`Quyền truy cập ${permissionName}`, 'Quyền không có sẵn trên thiết bị này. Vui lòng kiểm tra lại trong cài đặt của thiết bị');
            return false;
        case RESULTS.DENIED:
            const requestResult = await request(permissionType);
            return handlePermissionResult(requestResult, permissionType);
        case RESULTS.GRANTED:
            return true;
        case RESULTS.BLOCKED:
            const options = [
                { text: 'Đóng' },
                {
                    text: 'Cài đặt', onPress: () => {
                        Linking.openSettings().catch(() => {
                            toastError('Lỗi', 'Không thể mở cài đặt. Vui lòng vào cài đặt thủ công.');
                        });
                    }
                }
            ]
            messageConfirm(`Quyền bị chặn ${permissionName}`, 'Vui lòng kiểm tra lại các quyền sử dụng ứng dụng trong cài đặt', options)
            return false;
        default:
            return false;
    }
}
const getPermissionName = (type) => {
    switch (type) {
        case LOCATION_PERMISSION:
            return '"Quyền vị trí"'
        case CAMERA_PERMISSION:
            return '"Quyền máy ảnh"'
        case MICROPHONE_PERMISSION:
            return '"Quyền microphone"'
        case NOTIFICATIONS_PERMISSION:
            return '"Quyền thông báo"'
        case STORAGE_PERMISSION:
            return '"Quyền truy cập bộ nhớ"'
    }
}
//
export const LOCATION_PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
export const CAMERA_PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
export const MICROPHONE_PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
export const NOTIFICATIONS_PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.NOTIFICATIONS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
export const STORAGE_PERMISSION = Platform.OS === 'ios' ? null : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
//
export const PERMISSTION_LIST = [
    LOCATION_PERMISSION,
    CAMERA_PERMISSION,
    MICROPHONE_PERMISSION,
    NOTIFICATIONS_PERMISSION,
    STORAGE_PERMISSION
]


