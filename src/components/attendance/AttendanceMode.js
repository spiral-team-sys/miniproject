import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { useSelector } from "react-redux";
import { DeviceEventEmitter, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text } from "@rneui/themed";
import { fontWeightBold } from "../../utils/utility";
import FieldInput from "../fields/FieldInput";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { deviceHeight } from "../../styles/styles";
import CustomListView from "../lists/CustomListView";
import { MASTER_CONTROLLER } from "../../controllers/MasterController";
import appConfig from "../../utils/appConfig/appConfig";
import { ATTENDANT_CONTROLLER } from "../../controllers/AttendanceController";
import { isValidData } from "../../utils/validateData";
import { KEYs } from "../../utils/storageKeys";
import _ from 'lodash';

const AttendanceMode = ({ returnMode }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [modeValue, setModeValue] = useState('TC')
    const [itemReason, setItemReason] = useState({ reasonId: 0, reasonName: null, note: null, isDoneReport: 0 })
    const [dataMode, setDataMode] = useState([])
    const [dataReason, setDataReason] = useState([])
    const [_mutate, setMutate] = useState(false)
    //
    const LoadData = async () => {
        await MASTER_CONTROLLER.GetDataMaster({ listCode: 'KTC' }, setDataReason)
        await ATTENDANT_CONTROLLER.GetDataMode({
            shopId: shopInfo.shopId,
            auditDate: shopInfo.auditDate
        }, (mData, info) => {
            setDataMode(mData)
            setModeValue(info.mode)
            setItemReason(info)
        })
    }
    // Handler
    const handlerChangeMode = async (item) => {
        const dataUpdate = _.map(dataMode, (e) => { return e.ItemId == item.ItemId ? { ...e, isActive: true } : { ...e, isActive: false } })
        setDataMode(dataUpdate)
        setModeValue(item.ItemCode)
        setItemReason({ reasonId: 0, reasonName: null, note: null, isDoneReport: 0 })
        // 
        await ATTENDANT_CONTROLLER.UpdateDataMode({
            shopId: shopInfo.shopId,
            auditDate: shopInfo.auditDate,
            mode: item.ItemCode
        })
        //
        returnMode && returnMode(item.ItemCode)
        DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_MENU_REPORT)
    }
    const handlerPressReason = async (item) => {
        if (item.id == itemReason.reasonId) {
            itemReason.reasonId = 0
            itemReason.reasonName = null
        } else {
            itemReason.reasonId = item.id
            itemReason.reasonName = item.nameVN
        }
        setMutate(e => !e)
        await handlerSaveReason()
    }
    const onChangeText = async (text) => {
        itemReason.note = text
        setMutate(e => !e)
        await handlerSaveReason()
    }
    const onShowReasonList = () => {
        SheetManager.show(KEYs.ACTION_SHEET.REASON_SHEET)
    }
    const handlerSaveReason = async () => {
        const itemSave = {
            shopId: shopInfo.shopId,
            auditDate: shopInfo.auditDate,
            mode: modeValue,
            reasonId: itemReason.reasonId,
            reasonName: itemReason.reasonName,
            note: itemReason.note
        }
        await ATTENDANT_CONTROLLER.UpdateDataMode(itemSave)
    }
    //
    useEffect(() => {
        const reload_mode = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_MODE, LoadData)
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => {
            isMounted = false
            reload_mode.remove()
        }
    }, [])
    // View
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', backgroundColor: appColors.primaryColor },
        headerMode: { width: '50%', paddingVertical: Platform.OS == 'ios' ? 12 : 8, paddingHorizontal: 8, alignItems: 'center', borderTopStartRadius: 12, borderTopEndRadius: 12, backgroundColor: 'transparent' },
        titleStyle: { fontSize: 12, fontWeight: '700', color: appColors.lightColor, paddingHorizontal: 8 },
        contentMain: { flexDirection: 'row' },
        viewReason: { backgroundColor: appColors.backgroundColor },
        contentReasonList: { width: '100%', height: deviceHeight < (dataReason.length * 50) ? deviceHeight : (dataReason.length * 50), backgroundColor: appColors.backgroundColor },
        titleHeadReason: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor, textAlign: 'center', padding: 8 },
        itemReasonMain: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: appColors.borderColor },
        titleReason: { width: '95%', fontSize: 13, fontWeight: '500', color: appColors.textColor },
        labelStyle: { paddingTop: 8, fontSize: 12, fontStyle: 'italic' }
    })
    const renderItem = (item, index) => {
        const onPress = () => {
            handlerChangeMode(item)
        }
        const backgroundColor = item.isActive ? appColors.backgroundColor : 'transparent'
        const color = appColors[item.isActive ? item.color : 'lightColor']
        return (
            <TouchableOpacity key={`mode_item_${index}`} style={{ ...styles.headerMode, backgroundColor }} onPress={onPress} disabled={itemReason.isDoneReport == 1}>
                <Text style={{ ...styles.titleStyle, color }}>{itemReason.isDoneReport == 1 && modeValue !== item.ItemCode ? '' : item.ItemName}</Text>
            </TouchableOpacity>
        )
    }
    const renderItemReason = ({ item, index }) => {
        const onPressItem = () => {
            handlerPressReason(item)
        }
        const color = item.id == itemReason.reasonId ? appColors.errorColor : appColors.textColor
        return (
            <TouchableOpacity key={index} style={styles.itemReasonMain} onPress={onPressItem}>
                <Text style={{ ...styles.titleReason, color }}>{item.nameVN}</Text>
                {item.id == itemReason.reasonId && <Icon type={appConfig.ICON_TYPE} name='close-circle' color={appColors.errorColor} size={18} />}
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.contentMain}>
                {isValidData(dataMode) && dataMode.map(renderItem)}
            </View>
            <View style={styles.viewReason}>
                {modeValue == 'KTC' &&
                    <FieldInput
                        disabled={itemReason.isDoneReport == 1}
                        labelStyle={styles.labelStyle}
                        label={itemReason.reasonName || 'Lí do'}
                        placeholder='Ghi chú'
                        rightIconName={itemReason.isDoneReport == 1 ? null : 'list-circle'}
                        value={itemReason.note}
                        onChangeText={onChangeText}
                        onRightPress={onShowReasonList}
                    />
                }
            </View>
            <ActionSheet id={KEYs.ACTION_SHEET.REASON_SHEET} drawUnderStatusBar={Platform.OS == 'ios'} >
                <SafeAreaView style={styles.contentReasonList}>
                    <Text style={styles.titleHeadReason}>Lí do Không thành công</Text>
                    <CustomListView
                        data={dataReason}
                        extraData={dataReason}
                        renderItem={renderItemReason}
                    />
                </SafeAreaView>
            </ActionSheet>
        </View>
    )
}

export default AttendanceMode;