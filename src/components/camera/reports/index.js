import React, { useState, useEffect } from 'react';
import PreviewAction from '../PreviewAction';
import { messageAlert } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import { DeviceEventEmitter } from 'react-native';
import { KEYs } from '../../../utils/storageKeys';
import CameraReportAction from '../CameraReportAction';
import { PHOTO_CONTROLLER } from '../../../controllers/PhotoController';
import _ from 'lodash';

const CameraReportPage = ({ callBackData, templateInfo }) => {
    const { cameraReportInfo } = useSelector(state => state.camera)
    const [isLoading, setLoading] = useState(false)
    const [photoUri, setPhotoUri] = useState(null);
    const [isResetCamera, _setResetCamera] = useState(false)
    // 
    const handlerSavePhoto = async (uri) => {
        await setLoading(true)
        await PHOTO_CONTROLLER.SetDataPhotoReport([{ uri }], templateInfo)
        let eventDevice
        switch (templateInfo.reportId) {
            case 0:
                eventDevice = KEYs.DEVICE_EVENT.RELOAD_PHOTO_OVERVIEW
                break
            case 37: // AuditReport
                eventDevice = KEYs.DEVICE_EVENT.RELOAD_PHOTO_AUDIT
                break
            default:
                eventDevice = KEYs.DEVICE_EVENT.RELOAD_PHOTO_REPORT
                break
        }
        DeviceEventEmitter.emit(eventDevice)
        callBackData()
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
        callBackData()
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        return () => { isMounted = false }
    }, [cameraReportInfo])

    // View 
    if (photoUri)
        return <PreviewAction
            isLoading={isLoading}
            photoUri={photoUri}
            onSuccess={handlerSavePhoto}
            onReject={handlerReject}
        />
    //
    return <CameraReportAction
        hasPermission
        isResetCamera={isResetCamera}
        onPreview={handlerPreviewPicture}
        onClose={handlerCloseCamera} />
};
export default CameraReportPage;
