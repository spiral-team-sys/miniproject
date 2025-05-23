import React, { useEffect } from "react";
import { AppState, Platform, View } from "react-native";
import { REPORT_CONTROLLER } from "../../controllers/ReportController";
import { REPORT_API } from "../../services/reportApi";
import { TODAY, UPLOAD_INTERVAL } from "../../utils/utility";
import { initialHealthConnect, initializeHealthData } from "../../utils/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYs } from "../../utils/storageKeys";
import { isValidData } from "../../utils/validateData";

const CountStep = () => {
    const LoadData = async () => {
        const data = Platform.OS == 'ios' ? await initializeHealthData() : await initialHealthConnect()
        if (isValidData(data)) {
            await REPORT_CONTROLLER.InsertDataRaw({ data: data, shopId: 0, reportDate: TODAY.integer, reportId: 99 })
            await REPORT_CONTROLLER.UpdateDataRaw(0, 99, TODAY.integer, [{ data: data, shopId: 0, reportDate: TODAY.integer, reportId: 99 }])
        }
    }

    useEffect(() => {
        LoadData()
    }, []);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === "active") {
                const shouldUpload = await shouldUploadData();
                if (shouldUpload) {
                    await uploadData();
                    await updateLastUploadTime();
                }
            }
        };

        const appStateListener = AppState.addEventListener("change", handleAppStateChange);
        return () => appStateListener.remove();
    }, []);

    const uploadData = async () => {
        LoadData()
        await REPORT_CONTROLLER.GetDataCountStep(0, 99, TODAY.integer, async (mData) => {
            await REPORT_API.UploadDataReport(mData, async (result) => {
                result.messeger && toastSuccess('Thông báo', result.messeger)
            })
        })
    }

    const shouldUploadData = async () => {
        const lastUpload = await AsyncStorage.getItem(KEYs.DEVICE_EVENT.LAST_UPLOAD_TIME_HEALTH);
        const lastUploadTime = lastUpload ? parseInt(lastUpload, 10) : 0;
        const now = Date.now();
        return now - lastUploadTime >= UPLOAD_INTERVAL;
    };

    const updateLastUploadTime = async () => {
        await AsyncStorage.setItem(KEYs.DEVICE_EVENT.LAST_UPLOAD_TIME_HEALTH, Date.now().toString());
    };

    return (
        <View />
    )
}
export default CountStep