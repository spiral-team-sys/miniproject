import React, { useState, useEffect } from 'react';
import CameraAction from '../CameraAction';
import PreviewAction from '../PreviewAction';
import { messageAlert } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import { toastSuccess } from '../../../utils/configToast';
import { ATTENDANCE_API } from '../../../services/attendanceApi';
import { DeviceEventEmitter } from 'react-native';
import { KEYs } from '../../../utils/storageKeys';
import appConfig, { eoeApp } from '../../../utils/appConfig/appConfig';
import useConnect from '../../../hooks/useConnect';
import { REPORT_API } from '../../../services/reportApi';
import _ from 'lodash';

const CameraPage = ({ callBackData }) => {
    const { isOnlyWifi, connectionType } = useConnect()
    const { cameraInfo } = useSelector(state => state.camera)
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const { locationInfo } = useSelector(state => state.location)
    const [isLoading, setLoading] = useState(false)
    const [photoUri, setPhotoUri] = useState(null);
    const [isResetCamera, _setResetCamera] = useState(false)
    // 
    // Handler
    const handlerSavePhoto = async (uri) => {
        await setLoading(true)
        const dataUpload = { uri, shopInfo, menuReportInfo, locationInfo, cameraInfo }
        await ATTENDANCE_API.uploadDataAttendance(dataUpload, (message) => {
            message && toastSuccess('Thông báo', message)
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_ATTENDANCE)
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_MODE)
            if (appConfig.APPID == eoeApp) {
                DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_DOING, shopInfo)
            } else {
                DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_SHOP_BYPLAN)
            }
            // call auto upload file by setting
            if (!isOnlyWifi || (isOnlyWifi && connectionType == 'wifi')) {
                REPORT_API.UploadFileReport(shopInfo)
            }
            callBackData()
        })
        await setLoading(false)
    }
    const handlerPreviewPicture = (uri) => {
        setPhotoUri(uri)
    }
    const handlerReject = () => {
        setPhotoUri(null)
    }
    const handlerCloseCamera = (message) => {
        message && messageAlert('Thông báo', message)
        callBackData(null)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        return () => { isMounted = false }
    }, [cameraInfo])

    // View 
    if (photoUri)
        return <PreviewAction
            isLoading={isLoading}
            photoUri={photoUri}
            onSuccess={handlerSavePhoto}
            onReject={handlerReject}
        />
    //
    return <CameraAction
        cameraConfig={cameraInfo.cameraConfig || {}}
        resetCamera={isResetCamera}
        hasPermission={true}
        onPreview={handlerPreviewPicture}
        onClose={handlerCloseCamera}
    />

};

export default CameraPage;
