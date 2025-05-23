import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../../hooks/useTheme';
import CustomListView from './CustomListView';
import ItemAttendance from '../items/ItemAttendance';
import { LOCATION_INFO } from '../../utils/locationInfo/LocationInfo';
import { toastError } from '../../utils/configToast';
import { clearCameraInfo, setCameraInfo, setLocationInfo } from '../../redux/actions';
import { CAMERA_PERMISSION, checkAndRequestPermission, checkMultiplePermission, LOCATION_PERMISSION, MICROPHONE_PERMISSION, STORAGE_PERMISSION } from '../../utils/permissions';
import { ATTENDANT_CONTROLLER } from '../../controllers/AttendanceController';
import { KEYs } from '../../utils/storageKeys';
import { ATTENDANCE_API } from '../../services/attendanceApi';
import ViewPictures from '../gallary/ViewPictures';
import { VALID_CONTROLLER } from '../../controllers/ValidController';
import { SheetManager } from 'react-native-actions-sheet';
import { messageAlert } from '../../utils/helper';
import appConfig, { eoeApp } from '../../utils/appConfig/appConfig';

const AttendanceList = ({ navigation }) => {
    const { appColors } = useTheme();
    const { menuReportInfo } = useSelector(state => state.menu)
    const { shopInfo } = useSelector(state => state.shop)
    const [isLoading, setLoading] = useState(false)
    const [dataAttendance, setDataAttendance] = useState([])
    const [pictureShow, _setPictureShow] = useState({ visible: false, index: 0, dataShow: [] })
    const [_mutate, setMutate] = useState(false)
    const dispatch = useDispatch()
    //
    const LoadData = async () => {
        await checkAndRequestPermission(LOCATION_PERMISSION)
        const info = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            auditDate: shopInfo.auditDate,
            shiftCode: shopInfo.shiftCode,
            templateAttendance: JSON.parse(menuReportInfo.reportItem || '[]')
        }
        appConfig.APPID == eoeApp && await ATTENDANCE_API.getDataAttendance(info)
        await ATTENDANT_CONTROLLER.GetDataAttendance(info, async (mData, isChecked) => {
            if (isChecked) {
                await ATTENDANT_CONTROLLER.GetModeResult(shopInfo, (modeResult) => {
                    if (modeResult == 'TC')
                        SheetManager.show(KEYs.ACTION_SHEET.CHECKED_SHEET)
                })
            }
            setDataAttendance(mData)
        })
    }
    // Permisison
    const requestPermission = async () => {
        return await checkMultiplePermission([CAMERA_PERMISSION, MICROPHONE_PERMISSION, LOCATION_PERMISSION, STORAGE_PERMISSION])
    }
    // Handler
    const onAttendanceAction = async (item, isPhoto) => {
        if (isPhoto) {
            pictureShow.visible = true
            pictureShow.index = 0
            pictureShow.dataShow = [item]
            setMutate(e => !e)
        } else {
            const hasPermission = await requestPermission()
            if (hasPermission) {
                // Valid
                await VALID_CONTROLLER.attendanceReport({ item, shopInfo }, (isValid, message) => {
                    message && messageAlert('Thông báo', message)
                    if (isValid) {
                        setLoading(true)
                        LOCATION_INFO.getCurrentLocation(async (info) => {
                            dispatch(setLocationInfo(info))
                            dispatch(setCameraInfo(item))
                            navigation.navigate('Camera')
                            setLoading(false)
                        }, (error) => {
                            toastError(error)
                            setLoading(false)
                        })
                    }
                })
            } else {
                await dispatch(clearCameraInfo())
            }
        }
    }
    const onHidePicture = () => {
        pictureShow.visible = false
        pictureShow.index = 0
        pictureShow.dataShow = []
        setMutate(e => !e)
    }

    useEffect(() => {
        const reload_attandance = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_ATTENDANCE, LoadData)
        const reload_data_merge = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_DATA_MERGE_ATTENDANCE, LoadData)
        LoadData();
        return () => {
            reload_attandance.remove()
            reload_data_merge.remove()
        }
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        loadingView: { position: 'absolute', top: 16, end: 0, start: 0 }
    })
    const renderItem = ({ item, index }) => {
        return (
            <ItemAttendance
                appColors={appColors}
                index={index}
                item={item}
                onPress={onAttendanceAction}
            />
        )
    }
    return (
        <View style={styles.mainContainer}>
            {isLoading && <ActivityIndicator size='small' color={appColors.primaryColor} style={styles.loadingView} />}
            <CustomListView
                data={dataAttendance}
                extraData={dataAttendance}
                renderItem={renderItem}
                numColumns={2}
                onRefresh={LoadData}
            />
            <ViewPictures
                visible={pictureShow.visible}
                images={pictureShow.dataShow}
                initialIndex={pictureShow.index}
                onSwipeDown={onHidePicture}
            />
        </View>
    )
};
export default AttendanceList;
