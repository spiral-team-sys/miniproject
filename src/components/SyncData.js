import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, View } from "react-native";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { Text } from "@rneui/themed";
import { fontWeightBold } from "../utils/utility";
import { checkConnection } from "../utils/helper";
import { toastError } from "../utils/configToast";
import { MENU_API } from "../services/menuApi";
import { MASTER_API } from "../services/masterApi";
import { SHOP_API } from "../services/shopApi";
import { UpdateDatabase } from "../database/Database";
import { AUTH_API } from "../services/authApi";
import { KEYs } from "../utils/storageKeys";
import { PHOTO_CONTROLLER } from "../controllers/PhotoController";
import { REGION_API } from "../services/regionApi";
import appConfig, { brsApp } from "../utils/appConfig/appConfig";

const SyncData = forwardRef((props, ref) => {
    const { onCompleted } = props
    const { userInfo } = useAuth()
    const { appColors } = useTheme()
    const [isDownloading, setDownloading] = useState(false)
    //
    useImperativeHandle(ref, () => ({ onSyncData: handlerDownloadData }), [])
    //
    const handlerDownloadData = async () => {
        !isDownloading && await setDownloading(true)
        const isConnected = await checkConnection()
        if (!isConnected) {
            toastError('Kết nối mạng', 'Kết nối thất bại, vui lòng kiểm tra lại 4G/Wifi sau đó thử lại')
            setDownloading(false)
            return
        }
        // Check Version
        await DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.CHECK_VERSION, async (result) => {
            if (result.statusId == 403) {
                setDownloading(false)
                return
            } else {
                // Download Processing
                try {
                    await UpdateDatabase.updateColumnDatabase()
                    await PHOTO_CONTROLLER.AutoRemovePhoto()
                    await AUTH_API.devicelog()
                    // EOE  
                    await SHOP_API.GetDataStoreList()
                    await MENU_API.GetDataMenu()
                    await MASTER_API.GetDataMaster()
                    // BRS
                    if (appConfig.APPID == brsApp) {
                        await MASTER_API.GetDataAxle()
                        await REGION_API.GetDataProvince()
                    }
                    //
                    await onCompleted(true)
                } catch (error) {
                    toastError('Lỗi đồng bộ', `DownloadData: ${error}`)
                    onCompleted(false)
                }
                await setDownloading(false)
            }
        })
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        handlerDownloadData()
        return () => { isMounted = false }
    }, [userInfo])

    const styles = StyleSheet.create({
        mainContainer: { width: '100%', alignItems: 'center', zIndex: 1, marginTop: 8 },
        contentMain: { flexDirection: 'row', padding: 8, position: 'absolute', top: 0, backgroundColor: appColors.lightColor, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 50 },
        titleView: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.textColor, marginStart: 8 }
    })

    if (!isDownloading) return <View />
    return (
        <View style={styles.mainContainer}>
            <View style={styles.contentMain}>
                <ActivityIndicator size='small' color={appColors.textColor} />
                <Text style={styles.titleView}>Đang đồng bộ dữ liệu hệ thống</Text>
            </View>
        </View>
    )
})

export default SyncData;