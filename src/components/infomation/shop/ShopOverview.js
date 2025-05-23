import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useTheme from "../../../hooks/useTheme";
import { Icon } from "@rneui/themed";
import ViewPictures from "../../gallary/ViewPictures";
import appConfig, { eoeApp } from "../../../utils/appConfig/appConfig";
import { PHOTO_CONTROLLER } from "../../../controllers/PhotoController";
import { isValidData, isValidObject } from "../../../utils/validateData";
import { KEYs } from "../../../utils/storageKeys";
import { REPORT_API } from "../../../services/reportApi";
import { REPORT_CONTROLLER } from "../../../controllers/ReportController";
import Loading from "../../Loading";
import { LOCATION_INFO } from "../../../utils/locationInfo/LocationInfo";
import CachedImage from "../../images/CachedImage";
import { checkLinkType, getMaxDataByType } from "../../../utils/helper";
import { fontWeightBold } from "../../../utils/utility";
import _ from 'lodash';

const ShopOverview = ({ navigation, isOverview = false }) => {
    const { appColors } = useTheme()
    const { audioInfo } = useSelector(state => state.audio)
    const { shopInfo } = useSelector(state => state.shop)
    const [isLoading, setLoading] = useState(false)
    const [imageOverview, setImageOverview] = useState({ status: false, url: null })
    const [imageSignboard, setImageSignboard] = useState({ status: false, url: null })
    const [isDisabledPress, setDisabledPress] = useState(false)
    const [pictureShow, setPictureShow] = useState(false)
    const [photoType, setPhotoType] = useState(null)
    // 
    const LoadData = async () => {
        await PHOTO_CONTROLLER.GetDataPhotoByType(shopInfo.shopId, 0, shopInfo.auditDate, ['OVERVIEW', 'SIGNBOARD'], async (mPhoto) => {
            if (isValidData(mPhoto)) {
                handlerSetImage(mPhoto, 'OVERVIEW', setImageOverview)
                handlerSetImage(mPhoto, 'SIGNBOARD', setImageSignboard)
            } else {
                setImageOverview({ status: false, url: shopInfo.imageUrl })
                setImageSignboard({ status: false, url: null })
            }
        })
    }
    const UploadData = async () => {
        await setLoading(true)
        const info = {
            shopId: shopInfo.shopId,
            auditDate: shopInfo.auditDate,
            reportId: 0
        }
        await REPORT_CONTROLLER.GetDataOverviewUpload(info, async (mData) => {
            if (isValidObject(mData)) {
                await REPORT_API.UploadDataReport(mData, () => { setLoading(false) })
            } else {
                await setLoading(false)
            }
        })
    }
    // Handler
    const handlerSetImage = (dataPhoto, keyType, actionResult) => {
        const itemPhoto = getMaxDataByType(dataPhoto, 'photoType', keyType)
        if (itemPhoto?.photoPath) {
            if (itemPhoto.photoPath.startsWith('http://') || itemPhoto.photoPath.startsWith('https://')) {
                actionResult({ status: true, url: itemPhoto.photoPath });
            } else if (itemPhoto.photoPath.startsWith('/uploaded/')) {
                actionResult({ status: true, url: `${appConfig.URL_ROOT}${itemPhoto.photoPath}` });
            } else {
                actionResult({ status: false, url: itemPhoto.photoPath });
            }
        } else {
            actionResult({ status: false, url: null });
        }
    }
    const handlerCapturePicture = (photoType) => {
        setDisabledPress(true)
        LOCATION_INFO.getCurrentLocation((location) => {
            const templateInfo = { ...shopInfo, ...location, reportId: 0, photoType: photoType }
            navigation.navigate('CameraReport', { templateInfo })
            setDisabledPress(false)
        })
    }
    const onActionResult = async () => {
        DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_DOING_OVERVIEW, shopInfo)
        await UploadData()
        await LoadData()
    }
    const showImage = (type) => {
        setPhotoType(type)
        setPictureShow(true)
    }
    const onHidePicture = () => {
        setPictureShow(false)
    }
    const onRecord = () => {
        if (audioInfo?.isRecorder) {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_STOP)
        } else {
            const item = { isRecorder: true, reportId: -1, shopId: shopInfo.shopId, auditDate: shopInfo.auditDate }
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_START, item)
        }
    }
    //
    useEffect(() => {
        const reloadPhotoOverview = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_PHOTO_OVERVIEW, onActionResult);
        let isMounted = true;
        if (!isMounted) return;
        LoadData();
        return () => {
            isMounted = false;
            reloadPhotoOverview.remove();
        };
    }, [shopInfo]);
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        imageView: { width: '100%', height: '100%', borderRadius: 8 },
        contentAction: { position: 'absolute', flexDirection: 'row', zIndex: 1, right: 8, bottom: 8 },
        buttonCamera: { overflow: 'hidden', padding: 12, borderRadius: 50, marginEnd: 8 },
        buttonAudio: { overflow: 'hidden', padding: 12, borderRadius: 50 },
        overflowView: { backgroundColor: appColors.primaryColor, position: 'absolute', top: 0, end: 0, bottom: 0, start: 0, opacity: 0.8 },
        captureView: { flex: 1, minHeight: 200, borderRadius: 8, backgroundColor: appColors.backgroundColor, shadowColor: appColors.shadowColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, elevation: 3, borderWidth: 1, borderColor: appColors.borderColor },
        title: { color: appColors.textColor, fontWeight: fontWeightBold, fontStyle: 'italic', fontSize: 13, padding: 8 },
        itemMain: { flex: 1 }
    })
    const ItemImageAction = ({ title, keyValue, url, visible = false }) => {
        const onPress = () => {
            handlerCapturePicture(keyValue)
        }
        const onShow = () => {
            showImage(keyValue)
        }
        if (!visible) return <View />
        return (
            <View style={styles.itemMain}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.captureView}>
                    <View style={styles.contentAction}>
                        <TouchableOpacity style={styles.buttonCamera} activeOpacity={0.5} onPress={onPress} disabled={isDisabledPress}>
                            <View style={styles.overflowView} />
                            <Icon type={appConfig.ICON_TYPE} name="camera" size={28} color={appColors.whiteColor} />
                        </TouchableOpacity>
                        {keyValue == 'OVERVIEW' && (appConfig.APPID == eoeApp || (shopInfo.record || 0) == 1) &&
                            <TouchableOpacity style={styles.buttonAudio} activeOpacity={0.5} onPress={onRecord}>
                                <View style={{ ...styles.overflowView, backgroundColor: audioInfo?.isRecorder ? appColors.errorColor : appColors.primaryColor }} />
                                <Icon type={appConfig.ICON_TYPE} name="mic" size={28} color={appColors.whiteColor} />
                            </TouchableOpacity>
                        }
                    </View>
                    <Loading isLoading={isLoading} />
                    <CachedImage
                        uri={url}
                        style={styles.imageView}
                        resizeMode={url ? 'cover' : 'center'}
                        onPress={onShow}
                    />
                </View>
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <ItemImageAction
                visible
                keyValue='OVERVIEW'
                title='Hình tổng quát'
                url={imageOverview.url} />
            <ItemImageAction
                visible={appConfig.APPID == eoeApp && isOverview}
                keyValue='SIGNBOARD'
                title='Hình bảng hiệu'
                url={imageSignboard.url} />
            <ViewPictures
                visible={pictureShow}
                images={[{ ...shopInfo, url: photoType == 'OVERVIEW' ? checkLinkType(imageOverview.url) : checkLinkType(imageSignboard.url), photoType: photoType }]}
                initialIndex={0}
                onSwipeDown={onHidePicture}
            />
        </View>
    )
}

export default ShopOverview;