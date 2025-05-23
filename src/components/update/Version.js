import React, { useEffect } from "react";
import { PUBLIC_API } from "../../services/publicApi";
import { BackHandler, DeviceEventEmitter, Linking, Platform, View } from "react-native";
import { initializeDeviceInfo } from "../../utils/globals";
import DeviceInfo from "react-native-device-info";
import { messageAlert } from "../../utils/helper";
import { KEYs } from "../../utils/storageKeys";
import appConfig from "../../utils/appConfig/appConfig";
import { FIREBASE } from "../../utils/firebaseMessaging";

const ApplicationVersion = ({ }) => {
    const handlerCheckVersion = async (actionResult) => {
        const deviceInfo = await initializeDeviceInfo()
        const uniqueId = await DeviceInfo.getUniqueId()
        const params = {
            VersionId: deviceInfo.getBuildNumber,
            VersionName: deviceInfo.getVersion,
            DeviceId: uniqueId,
            PlatForm: Platform.OS,
            FirebaseToken: await FIREBASE.getFCMToken()
        }
        await PUBLIC_API.CheckVersion(params, (item) => {
            if (parseInt(item?.versionId) > parseInt(deviceInfo?.getBuildNumber)) {
                actionResult && actionResult({ statusId: 403 })
                messageAlert(
                    'Cập nhật ứng dụng',
                    `Đã có bản cập nhật ${item.versionCode} cho ứng dụng, Vui lòng cập nhật ứng dụng phiên bản mới nhất để tiếp tục làm việc`,
                    () => onUpdate(item.storeUrl, deviceInfo.getBundleId)
                )
            } else {
                actionResult && actionResult({ statusId: 200 })
            }
        })
    }
    const onUpdate = (urlIOS, bundleId) => {
        const androidUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;
        const iosUrl = urlIOS || `https://apps.spiral.com.vn/${appConfig.APPID}`;
        const url = Platform.OS === 'ios' ? iosUrl : androidUrl;
        Linking.openURL(url)
            .then(() => { BackHandler.exitApp() })
            .catch((err) => {
                console.error('Lỗi khi mở đường dẫn', err);
            });
    }

    useEffect(() => {
        const _checkVersion = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.CHECK_VERSION, handlerCheckVersion)
        return () => { _checkVersion.remove() }
    }, [])

    return <View />
}
export default ApplicationVersion;