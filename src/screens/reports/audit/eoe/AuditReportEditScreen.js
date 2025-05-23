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
import Loading from "../../../../components/Loading";
import { REPORT_CONTROLLER } from "../../../../controllers/ReportController";
import FloatActionButton from "../../../../components/floataction/FloatActionButton";
import { KEYs } from "../../../../utils/storageKeys";
import { ImagePickerManager } from "../../../../utils/imagePicker/ImagePickerManager";
import { PHOTO_CONTROLLER } from "../../../../controllers/PhotoController";
import { isValidData } from "../../../../utils/validateData";
import { handlerGoBack, messageAlert, messageConfirm } from "../../../../utils/helper";
import { VALID_CONTROLLER } from "../../../../controllers/ValidController";
import UploadWaiting from "../../../../components/UploadWaiting";
import { AUDIT_CONTROLLER } from "../../../../controllers/AuditController";
import EDIT_NNDVISIBILITYScreen from "./edit/EDIT_NNDVISIBILITYScreen";
import EDIT_PlanogramScreen from "./edit/EDIT_PlanogramScreen";
import EDIT_FSScreen from "./edit/EDIT_FSScreen";
import EDIT_PowerClaimScreen from "./edit/EDIT_PowerClaimScreen";
import EDIT_ShareOfFeaturesScreen from "./edit/EDIT_ShareOfFeaturesScreen";
import EDIT_PriceScreen from "./edit/EDIT_PriceScreen";
import EDIT_VisibilityScreen from "./edit/EDIT_VisibilityScreen";
import EDIT_NNDFSScreen from "./edit/EDIT_NNDFSScreen";
import _ from 'lodash';
import PiPControl from "../../../../components/images/PiPControl";
import PromotionScreen from "./kpi/PromotionScreen";

const AuditReportEditScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { audioInfo } = useSelector(state => state.audio)
    const { shopInfo } = useSelector(state => state.shop)
    const { menuHomeInfo } = useSelector(state => state.menu)
    const [isLoading, setLoading] = useState(true)
    const [isWaiting, setWaiting] = useState(false)
    const [refresh, setRefresh] = useState({})
    const [dataMain, setDataMain] = useState([])
    const [dataPhoto, setDataPhoto] = useState([])
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
            reportId: menuHomeInfo.id,
            reportDate: shopInfo.auditDate,
            auditId: shopInfo.auditId
        }
        console.log(item);

        await REPORT_API.GetDataByShop(item, (mData, mPhoto, _lastupdate, _uploaded, _isLocked, message) => {
            message && toastError('Thông báo', message)
            if (isValidData(mData)) {
                indexTab.index = 0
                indexTab.tabId = 0
                indexTab.tabName = mData[0]?.ItemName || null
                //
                setDataMain(mData)
                setDataPhoto(mPhoto)
                setLastUpdate(_lastupdate)
                setUploaded(mData[0].isEditReport == 0)
            }
        })
        await setLoading(false)
    }
    const UploadData = async () => {
        if (!isUploaded) {
            const options = [{ text: 'Hủy' }, {
                text: 'Đồng ý', onPress: async () => {
                    await setWaiting(true)
                    await VALID_CONTROLLER.editAuditReport({ shopInfo, menuHomeInfo }, dataMain, async (isValid, message) => {
                        if (isValid) {
                            const info = {
                                shopId: shopInfo.shopId,
                                auditDate: shopInfo.auditDate,
                                reportId: menuHomeInfo.id
                            }
                            await REPORT_CONTROLLER.GetDataReportUpload(info, async (mData) => {
                                // Upload Report  
                                await REPORT_API.UploadDataReport(mData, async (result) => {
                                    result.messeger && toastSuccess('Thông báo', result.messeger)
                                    if (result.statusId == 200) {
                                        // Remove Data
                                        await REPORT_CONTROLLER.RemoveDataRaw(info.shopId, info.reportId, info.auditDate)
                                        await LoadData()
                                    }
                                    await setWaiting(false)
                                })
                            })
                        } else {
                            messageAlert('Dữ liệu báo cáo', message)
                            await setWaiting(false)
                        }
                    })
                }
            }]
            messageConfirm('Thông báo', 'Bạn có muốn cập nhật dữ liệu lên hệ thống không?', options)
        }
    }
    // Handler
    const handlerCallBack = async (itemSave) => {
        const dataUpdate = _.map(dataMain, (e) => {
            return (e.ItemId == itemSave.ItemId) ? itemSave : e
        })
        setDataMain(dataUpdate)
        await REPORT_CONTROLLER.UpdateDataRaw(shopInfo.shopId, menuHomeInfo.id, shopInfo.auditDate, dataUpdate)
    }
    const onTabChange = async (itemTab) => {
        indexTab.index = itemTab.index
        indexTab.tabId = itemTab.index
        indexTab.tabName = itemTab.tabName
        setMutate(e => !e)
    }
    const onShowMenuFAB = async () => {
        const _photoType = dataMain[indexTab.index]?.ItemCode || null
        const lstPhoto = await PHOTO_CONTROLLER.GetDataPhotoByType(shopInfo.shopId, menuHomeInfo.id, shopInfo.auditDate, _photoType)
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
            reportId: menuHomeInfo.id,
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
        const tempInfo = {
            photoType: indexTab.tabName,
            photoMore: '',
            photoDesc: ''
        }
        await ImagePickerManager.captureMultiplePhoto(async (photos) => {
            const dataPhoto = await PHOTO_CONTROLLER.SetDataPhotoReport(photos, {
                ...tempInfo,
                ...shopInfo,
                reportId: menuHomeInfo.id
            })
            //
            indexTab.countPhoto = (indexTab.countPhoto + dataPhoto.length)
            setMutate(e => !e)
        }, dataMain[indexTab.index]?.maxPhotos)
    }
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
        navigation.navigate('Gallary', { data: dataPhoto })
    }
    const onRefreshData = () => {
        let options = [{ text: 'Hủy' }, { text: 'Xác nhận', onPress: hanlderRefreshData }]
        messageConfirm('Làm mới dữ liệu', 'Sau khi xác nhận dữ liệu sẽ được cập nhật từ hệ thống, Bạn có chắc không ?', options)
    }
    const onCheckAllData = async () => {
        await setRefresh({ [`${indexTab.tabName}`]: true })
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuHomeInfo.id,
            reportDate: shopInfo.auditDate,
            kpiName: indexTab.tabName,
            dataLocal: dataMain || []
        }
        await AUDIT_CONTROLLER.SetDataDisplayNo(item, (mData) => {
            if (isValidData(mData)) {
                menu.isOpen = false
                setDataMain(mData)
            }
        })
        await setRefresh({ [`${indexTab.tabName}`]: false })
    }
    //
    useEffect(() => {
        const _load = LoadData()
        return () => _load
    }, [])
    // View
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1
        }
    })
    const renderItemTab = (item) => {
        const dataKPI = JSON.parse(item.JsonData || '[]')
        switch (item.ItemCode) {
            case 'FS':
                return <EDIT_FSScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'NND&FS':
                return <EDIT_NNDFSScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'NND&VISIBILITY':
                return <EDIT_NNDVISIBILITYScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'VISIBILITY':
            case 'VISIBILITYMT':
                return <EDIT_VisibilityScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'PRICE':
                return <EDIT_PriceScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'PLANOGRAM':
                return <EDIT_PlanogramScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'POWERCLAIM':
                return <EDIT_PowerClaimScreen
                    isUploaded={isUploaded}
                    isRefreshData={refresh[indexTab.tabName]}
                    itemMain={item}
                    data={dataKPI}
                    callBackData={handlerCallBack} />
            case 'SOF':
                return <EDIT_ShareOfFeaturesScreen
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
                title={shopInfo.shopName}
                subTitle={`Cập nhật lúc ${lastUpdate || 'none-update'}`}
                iconNameRight={isUploaded ? 'cloud-done-outline' : 'sync-outline'}
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={UploadData}
            />
            <UploadWaiting isWaiting={isWaiting} />
            <View>
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
                <PiPControl data={dataPhoto} intialPositon={{ x: 0, y: 0 }} />
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
export default AuditReportEditScreen;