import React, { useEffect, useState } from "react";
import useTheme from "../../../../hooks/useTheme";
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { REPORT_API } from "../../../../services/reportApi";
import { useSelector } from "react-redux";
import GradientBackground from "../../../../components/GradientBackground";
import Header from "../../../../components/Header";
import { toastError, toastSuccess } from "../../../../utils/configToast";
import CustomTab from "../../../../components/CustomTab";
import FSScreen from "./kpi/FSScreen";
import NNDFSScreen from "./kpi/NNDFSScreen";
import NNDVISIBILITYScreen from "./kpi/NNDVISIBILITYScreen";
import VisibilityScreen from "./kpi/VisibilityScreen";
import PriceScreen from "./kpi/PriceScreen";
import PlanogramScreen from "./kpi/PlanogramScreen";
import Loading from "../../../../components/Loading";
import { REPORT_CONTROLLER } from "../../../../controllers/ReportController";
import PowerClaimScreen from "./kpi/PowerClaimScreen";
import ShareOfFeaturesScreen from "./kpi/ShareOfFeaturesScreen";
import FloatActionButton from "../../../../components/floataction/FloatActionButton";
import { KEYs } from "../../../../utils/storageKeys";
import { PHOTO_CONTROLLER } from "../../../../controllers/PhotoController";
import { isValidData } from "../../../../utils/validateData";
import { handlerGoBack, messageAlert, messageConfirm } from "../../../../utils/helper";
import { VALID_CONTROLLER } from "../../../../controllers/ValidController";
import UploadWaiting from "../../../../components/UploadWaiting";
import { AUDIT_CONTROLLER } from "../../../../controllers/AuditController";
import StockScreen from "./kpi/StockScreen";
import useConnect from "../../../../hooks/useConnect";
import PromotionScreen from "./kpi/PromotionScreen";
import _ from 'lodash';

const AuditReportScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { isOnlyWifi, connectionType } = useConnect()
    const { audioInfo } = useSelector(state => state.audio)
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const [isLoading, setLoading] = useState(true)
    const [isWaiting, setWaiting] = useState(false)
    const [refresh, setRefresh] = useState({})
    const [dataMain, setDataMain] = useState([])
    const [isLocked, setLocked] = useState(false)
    const [isUploaded, setUploaded] = useState(false)
    const [lastUpdate, setLastUpdate] = useState('')
    const [menu, _setMenu] = useState({ isOpenCamera: false, isOpen: false, type: null, title: null })
    const [indexTab, _setIndexTab] = useState({ index: 0, tabId: 0, tabName: null, countPhoto: null })
    const [_mutate, setMutate] = useState(false)
    //
    const LoadData = async () => {
        if (!isLoading) await setLoading(true)
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            reportDate: shopInfo.auditDate
        }
        await REPORT_API.GetDataByShop(item, (mData, _mPhoto, _lastupdate, uploaded, isLocked, message) => {
            message && toastError('Thông báo', message)
            if (isValidData(mData)) {
                indexTab.index = 0
                indexTab.tabId = 0
                indexTab.tabName = mData[0]?.ItemName || null
                //
                setDataMain(mData)
                setLastUpdate(_lastupdate)
                setLocked(isLocked == 1)
                setUploaded(uploaded == 1)
            }
        })
        await setLoading(false)
    }
    const LoadPhoto = async () => {
        const _photoType = dataMain[indexTab.index]?.ItemCode || null
        const lstPhoto = await PHOTO_CONTROLLER.GetDataPhotoByType(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, _photoType)
        indexTab.countPhoto = lstPhoto.length
        setMutate(e => !e)
    }
    const UploadData = async () => {
        if (isUploaded) {
            toastSuccess('Thông báo', 'Đã hoàn thành báo cáo')
            return
        }
        //
        const options = [{ text: 'Hủy' }, {
            text: 'Gửi',
            onPress: async () => {
                await setWaiting(true)
                await VALID_CONTROLLER.auditReport({ shopInfo, menuReportInfo }, dataMain, async (isValid, message) => {
                    if (isValid) {
                        const info = {
                            shopId: shopInfo.shopId,
                            auditDate: shopInfo.auditDate,
                            reportId: menuReportInfo.id
                        }
                        await REPORT_CONTROLLER.SetLockDataRaw(shopInfo.shopId, shopInfo.auditDate, menuReportInfo.id)
                        await REPORT_CONTROLLER.GetDataReportUpload(info, async (mData) => {
                            // Upload Report 
                            await REPORT_API.UploadDataReport(mData, async (result) => {
                                result.messeger && toastSuccess('Thông báo', result.messeger)
                                LoadData()
                                await setWaiting(false)
                            })
                        })
                        ///Gui hinh anh theo cài đặt
                        if (!isOnlyWifi || (isOnlyWifi && connectionType == 'wifi')) {
                            REPORT_API.UploadFileReport(shopInfo)
                        }
                    } else {
                        messageAlert('Dữ liệu báo cáo', message)
                        await setWaiting(false)
                    }
                })
            }
        }]
        messageConfirm('Thông báo', 'Bạn có muốn gửi dữ liệu lên hệ thống không ?', options)
    }
    // Handler
    const handlerCallBack = async (itemSave) => {
        const dataUpdate = _.map(dataMain, (e) => {
            return (e.ItemId == itemSave.ItemId) ? itemSave : e
        })
        setDataMain(dataUpdate)
        await REPORT_CONTROLLER.UpdateDataRaw(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, dataUpdate)
    }
    const onTabChange = async (itemTab) => {
        indexTab.index = itemTab.index
        indexTab.tabId = itemTab.index
        indexTab.tabName = itemTab.tabName
        setMutate(e => !e)
    }
    const onShowMenuFAB = async () => {
        const _photoType = dataMain[indexTab.index]?.ItemCode || null
        const lstPhoto = await PHOTO_CONTROLLER.GetDataPhotoByType(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, _photoType)
        indexTab.countPhoto = lstPhoto.length
        //
        menu.isOpen = !menu.isOpen
        setMutate(e => !e)
    }
    const handlerChangeFAB = async (type) => {
        switch (type) {
            case "CAMERA":
                onTakePicture()
                break
            case "AUDIO":
                onRecord()
                break
            case "ALBUM":
                onShowPicture()
                break
            case "REFRESHDATA":
                onRefreshData()
                break
            case "CHECKALL":
                onCheckAllData()
                break
        }
    }
    const hanlderRefreshData = async () => {
        await setRefresh({ [`${indexTab.tabName}`]: true })
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            reportDate: shopInfo.auditDate,
            kpiName: indexTab.tabName,
            dataLocal: dataMain || []
        }
        await REPORT_API.RefreshDataByShop(item, async (mData, mLastUpdate) => {
            if (isValidData(mData)) {
                menu.isOpen = false
                //
                setDataMain(mData)
                setLastUpdate(mLastUpdate)
            }
        })
        await setRefresh({ [`${indexTab.tabName}`]: false })
    }
    // Action FAB
    const onTakePicture = async () => {
        try {
            const templateInfo = { ...shopInfo, reportId: menuReportInfo.id, photoType: indexTab.tabName }
            navigation.navigate('CameraReport', { templateInfo })
        } catch (error) {
            console.error('Unexpected error in onTakePicture:', error);
            toastInfo('Lỗi', 'Máy ảnh không hoạt động, vui lòng kiểm tra thiết bị.');
        }
    };
    const onRecord = () => {
        if (audioInfo?.isRecorder) {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_STOP)
        } else {
            menu.isOpen = false
            setMutate(e => !e)
            //
            const item = { isRecorder: true, reportId: -1, shopId: shopInfo.shopId, auditDate: shopInfo.auditDate }
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_START, item)
        }
    }
    const onShowPicture = () => {
        navigation.navigate('Gallary')
    }
    const onRefreshData = () => {
        let options = [{ text: 'Hủy' }, { text: 'Xác nhận', onPress: hanlderRefreshData }]
        messageConfirm('Làm mới dữ liệu', 'Sau khi xác nhận dữ liệu sẽ được cập nhật từ hệ thống, Bạn có chắc không ?', options)
    }
    const onCheckAllData = async () => {
        await setRefresh({ [`${indexTab.tabName}`]: true })
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            reportDate: shopInfo.auditDate,
            kpiName: indexTab.tabName,
            dataLocal: dataMain || []
        }
        if (indexTab.tabName == 'PRICE') {
            await AUDIT_CONTROLLER.SetDataPriceNone(item, (mData) => {
                if (isValidData(mData)) {
                    menu.isOpen = false
                    setDataMain(mData)
                }
            })
        } else {
            await AUDIT_CONTROLLER.SetDataDisplayNo(item, (mData) => {
                if (isValidData(mData)) {
                    menu.isOpen = false
                    setDataMain(mData)
                }
            })
        }
        await setRefresh({ [`${indexTab.tabName}`]: false })
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    useEffect(() => {
        if (dataMain.length > 0) {
            const reload_photo = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_PHOTO_AUDIT, LoadPhoto)
            return () => { reload_photo.remove() }
        }
    }, [dataMain])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderItemTab = (item) => {
        const dataKPI = JSON.parse(item.JsonData || '[]')
        switch (item.ItemCode) {
            case 'FS':
                return <FSScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'NND&FS':
                return <NNDFSScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'NND&VISIBILITY':
                return <NNDVISIBILITYScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'VISIBILITY':
            case 'VISIBILITYMT':
                return <VisibilityScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'PRICE':
                return <PriceScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'PLANOGRAM':
                return <PlanogramScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'POWERCLAIM':
                return <PowerClaimScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'SOF':
                return <ShareOfFeaturesScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'STOCK':
                return <StockScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'PROMOTION':
                return <PromotionScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            default:
                return <View />
        }
    }
    if (isLoading) return <Loading isLoading={isLoading} color={appColors.primaryColor} />
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={menuReportInfo.menuNameVN || 'Chấm điểm'}
                subTitle={`Cập nhật lúc ${lastUpdate || 'none-update'}`}
                iconNameRight={isUploaded ? 'cloud-done' : isLocked ? 'lock-closed' : 'cloud-upload'}
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={UploadData}
                disabledRight={isWaiting}
            />
            <UploadWaiting isWaiting={isWaiting} />
            {/* // Content KPI */}
            <View style={styleDefault.contentMain}>
                <CustomTab
                    scrollEnabled={false}
                    data={dataMain}
                    appColors={appColors}
                    renderItem={renderItemTab}
                    onTabChange={onTabChange}
                />
            </View>
            {/* // Float Action View */}
            {menu.isOpen && <TouchableOpacity style={styleDefault.overflowView} onPress={onShowMenuFAB} activeOpacity={0.65} />}
            <FloatActionButton
                info={menu}
                isUploaded={isUploaded}
                tabInfo={indexTab}
                showMenu={onShowMenuFAB}
                handlerChange={handlerChangeFAB}
            />
        </SafeAreaView>
    )
}
export default AuditReportScreen;