import React, { useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "../../hooks/useTheme";
import { setShopInfo } from "../../redux/actions";
import CustomListView from "./CustomListView";
import { SHOP_CONTROLLER } from "../../controllers/ShopController";
import SearchData from "../SearchData";
import { messageConfirm, removeVietnameseTones } from "../../utils/helper";
import { isValidData, isValidField } from "../../utils/validateData";
import Loading from "../Loading";
import ItemShopByWorkingPlan from "../items/ItemShopByWorkingPlan";
import { KEYs } from "../../utils/storageKeys";
import GroupData from "../GroupData";
import PlanInfoSheet from "../bottomsheet/PlanInfoSheet";
import { AUDIO_CONTROLLER } from "../../controllers/AudioController";
import _ from 'lodash';
import ShopInfoSheet from "../bottomsheet/ShopInfoSheet";

const WorkingPlanList = ({ navigation, onRefresh }) => {
    const { appColors, styleDefault } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const { audioInfo } = useSelector(state => state.audio)
    const [isLoading, setLoading] = useState(true)
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const dispatch = useDispatch()
    const bottomSheetRef = useRef()
    let debounceTimeout;
    //
    const LoadData = async () => {
        bottomSheetRef.current.close()
        !isLoading && await setLoading(true)
        await SHOP_CONTROLLER.GetDataShop((shoplist) => {
            setData(shoplist)
            setDataMain(shoplist)
        })
        await setLoading(false)
    }
    // Handler
    const handlerRefresh = async () => {
        await setLoading(true)
        onRefresh && await onRefresh()
        await LoadData()
    }
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        bottomSheetRef.current.close()
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const shoplist = _searchData(listChooseGroup)
        await setDataMain(listChooseGroup)
        await setData(shoplist)
    }
    const handlerPress = async (item) => {
        await dispatch(setShopInfo(item))
        if (bottomSheetRef.current && isValidField(item.shopCode))
            bottomSheetRef.current.snapToIndex(0)
    }
    const handlerStartWork = async () => {
        await AUDIO_CONTROLLER.GetDataAudio(shopInfo.shopId, shopInfo.auditDate, (audioList) => {
            if (isValidData(audioList)) {
                bottomSheetRef.current.close()
                navigation.navigate('Work')
            } else {
                const options = [
                    {
                        text: 'Bỏ qua', onPress: () => {
                            bottomSheetRef.current.close()
                            navigation.navigate('Work')
                        }
                    }, {
                        text: 'Đồng ý', onPress: () => {
                            onRecord()
                            bottomSheetRef.current.close()
                            navigation.navigate('Work')
                        }
                    }
                ]
                messageConfirm('Ghi âm', 'Vui lòng bật ghi âm trước khi chấm điểm', options)
            }
        })
    }
    //
    const onRecord = () => {
        if (audioInfo?.isRecorder) {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_STOP)
        } else {
            const item = { isRecorder: true, reportId: -1, shopId: shopInfo.shopId, auditDate: shopInfo.auditDate }
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_START, item)
        }
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMain)
            setData(listUpdate)
        }, 100)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        //
        let dataChooseTag = _.filter(filterList, (e) => e.isChooseTag == 1)
        if (!isValidData(dataChooseTag))
            dataChooseTag = filterList
        //
        const searchData = _.filter(dataChooseTag, (e) => (
            removeVietnameseTones(e.shopName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.shopCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.address).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.subSegment).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    //
    useEffect(() => {
        const reload_status = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_SHOP_BYPLAN, LoadData)
        let isMounted = true
        if (!isMounted)
            return
        LoadData();
        return () => {
            isMounted = false
            reload_status.remove()
        }
    }, [])

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderShopItem = ({ item, index }) => (
        <ItemShopByWorkingPlan
            item={item}
            index={index}
            appColors={appColors}
            styleDefault={styleDefault}
            onPress={handlerPress} />
    )
    return (
        <View style={styles.mainContainer}>
            <SearchData
                placeholder='Tìm kiếm cửa hàng'
                value={search.text}
                onSearchData={onSearchData}
            />
            <Loading isLoading={isLoading} color={appColors.primaryColor} isOpacityView />
            <GroupData
                dataMain={dataMain}
                keyName='statusName'
                keyValue='statusName'
                handlerChange={handlerSearchByGroup}
            />
            <CustomListView
                isCheckData
                data={data}
                extraData={data}
                renderItem={renderShopItem}
                onRefresh={handlerRefresh}
            />
            <ShopInfoSheet
                ref={bottomSheetRef}
                navigation={navigation}
                shopInfo={shopInfo}
                onStartWork={handlerStartWork}
            />
        </View>
    )
}

export default WorkingPlanList;