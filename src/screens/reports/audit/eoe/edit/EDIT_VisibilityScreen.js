import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from "../../../../../hooks/useTheme";
import { convertDataToString, groupDataByKey } from "../../../../../utils/helper";
import { deviceHeight } from "../../../../../styles/styles";
import CustomListView from "../../../../../components/lists/CustomListView";
import { Icon, Text } from "@rneui/themed";
import appConfig from "../../../../../utils/appConfig/appConfig";
import { fontWeightBold } from "../../../../../utils/utility";
import GroupCheckBox from "../../../../../components/GroupCheckBox";
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { KEYs } from "../../../../../utils/storageKeys";
import FastImage from "react-native-fast-image";
import _ from 'lodash';

const EDIT_VisibilityScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataVisibility, setDataVisibility] = useState([])
    const [itemVisibility, setItemVisibility] = useState({})
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    //
    const LoadData = () => {
        const { arr } = groupDataByKey({
            arr: data,
            key: 'GroupId'
        })
        setDataVisibility(arr)
    }
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataVisibility)
        setDataVisibility(dataUpdate || dataVisibility)
        callBackData(itemMain)
    }
    // Handler
    const handlerCheckItem = (value, item) => {
        item.DisplayValue = value
        setMutate(e => !e)
        //
        if ((item?.isReason || 0) == 1 && value == 0) {
            handlerSaveItem()
            SheetManager.show(KEYs.ACTION_SHEET.REASON_REPORT_PD_SHEET, { payload: { ...item, dataReason: JSON.parse(item?.dataReason || '[]') } })
        } else {
            const reasonUpdate = _.map(JSON.parse(item.dataReason), (e) => { return { ...e, isChoose: false } })
            const dataUpdate = _.map(dataVisibility, (e) => {
                if (e.ItemId == item.ItemId) {
                    return { ...e, ReasonValue: null, dataReason: JSON.stringify(reasonUpdate) }
                } else {
                    return e
                }
            })
            handlerSaveItem(dataUpdate)
        }
    }
    const handlerShowReason = (item) => {
        SheetManager.show(KEYs.ACTION_SHEET.REASON_REPORT_PD_SHEET, { payload: { ...item, dataReason: JSON.parse(item.dataReason) } })
    }
    const handlerPressReason = (item) => {
        const reasonUpdate = _.map(itemVisibility.dataReason, (e) => {
            if (item.ItemId == e.ItemId) {
                return { ...e, isChoose: !(item.isChoose || false) }
            } else {
                return e
            }
        })
        const reasonValue = _.chain(reasonUpdate)
            .filter(item => item.isChoose)
            .map('ItemName')
            .join(', ')
            .value();


        const dataUpdate = _.map(dataVisibility, (e) => {
            if (e.ItemId == itemVisibility.ItemId) {
                return { ...e, dataReason: JSON.stringify(reasonUpdate), ReasonValue: reasonValue }
            } else {
                return e
            }
        })
        setItemVisibility({ ...itemVisibility, dataReason: reasonUpdate })
        handlerSaveItem(dataUpdate)
    }
    const onNote = (text) => {
        itemMain.NoteKPIValue = text
        callBackData(itemMain)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [isRefreshData])

    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: '100%', backgroundColor: appColors.backgroundColor, marginTop: 8 },
        itemMain: { width: '100%', padding: 8 },
        viewHeadGroup: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 8, paddingTop: 0 },
        titleGroup: { fontSize: 14, fontWeight: '700', color: appColors.subTextColor, fontStyle: 'italic', paddingHorizontal: 8 },
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, },
        titleReasonValue: { fontSize: 12, fontWeight: '500', color: appColors.errorColor, paddingBottom: 8 },
        actionView: { width: '100%' },
        contentCheckBox: { width: '35%', alignSelf: 'flex-end' },
        bottomView: { paddingBottom: deviceHeight / 6 },
        contentReasonList: { width: '100%', height: deviceHeight < (itemVisibility.dataReason?.length * 50) ? deviceHeight : (itemVisibility.dataReason?.length * 50), backgroundColor: appColors.backgroundColor },
        titleHeadReason: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor, textAlign: 'center', padding: 8 },
        itemReasonMain: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: appColors.borderColor },
        titleReason: { width: '95%', fontSize: 13, fontWeight: '500', color: appColors.textColor },
        labelStyle: { paddingTop: 8, fontSize: 12, fontStyle: 'italic' },
        titleSubName: { fontSize: 13, fontWeight: '500', color: appColors.subTextColor },
    })
    const renderItem = ({ item, index }) => {
        const onCheckBoxPress = (value) => {
            handlerCheckItem(value, item, index)
        }
        const onShowReason = () => {
            handlerShowReason(item)
        }
        const reasonValue = convertDataToString(JSON.parse(item?.dataReason || '[]'), 'isChoose', 'ItemName')
        return (
            <View key={`svi_${index}`} style={styles.itemMain}>
                {item.isParent &&
                    <View style={styles.viewHeadGroup}>
                        <Icon type={appConfig.ICON_TYPE} name="ellipse" color={appColors.highlightColor} />
                        <Text style={styles.titleGroup}>{item.GroupName}</Text>
                    </View>
                }
                <View style={styleDefault.contentItemMain}>
                    <Text style={styles.titleName}>{`${index + 1}. ${item.ItemName}`}</Text>
                    {item.ItemSubName && <Text style={styles.titleSubName}>{`${item.ItemSubName}`}</Text>}
                    {(item?.isReason || 0) == 1 &&
                        <TouchableOpacity onPress={onShowReason}>
                            {item.DisplayValue == 0 && <Text style={styles.titleReasonValue}>{`Đã chọn: ${reasonValue || ''}`}</Text>}
                        </TouchableOpacity>
                    }
                    <FastImage
                        source={{ uri: item.PhotoPath, priority: 'low' }}
                        style={{ width: '100%', height: 150, alignItems: "center", marginBottom: 8 }}
                        placeholderStyle={{ backgroundColor: 'transparent' }}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                    <View style={styles.actionView}>
                        <GroupCheckBox
                            enabled
                            title1={item?.YesButton || 'Có'}
                            title2={item?.NoButton || 'Không'}
                            isUploaded={isUploaded}
                            itemMain={item}
                            contentStyle={{ flexDirection: item?.YesButton == "Không" ? "row-reverse" : "row" }}
                            onPress={onCheckBoxPress}
                        />
                    </View>
                </View>
            </View>
        )
    }
    const renderItemReason = ({ item, index }) => {
        const onPressItem = () => {
            handlerPressReason(item)
        }
        const color = item.isChoose ? appColors.errorColor : appColors.textColor
        return (
            <TouchableOpacity key={index} style={styles.itemReasonMain} onPress={onPressItem}>
                <Text style={{ ...styles.titleReason, color }}>{item.ItemName}</Text>
                {item.isChoose && <Icon type={appConfig.ICON_TYPE} name='close-circle'
                    color={appColors.errorColor} size={18} />}
            </TouchableOpacity>
        )
    }
    if (isRefreshData) return <ActivityIndicator size='small' color={appColors.primaryColor} style={styleDefault.refreshView} />
    return (
        <View style={styles.mainContainer}>
            <FieldNoteKPI
                placeholder={`Ghi chú ${itemMain.ItemCode}`}
                value={itemMain.NoteKPIValue}
                onChangeData={onNote}
            />
            <CustomListView
                ref={listRef}
                data={dataVisibility}
                extraData={[dataVisibility]}
                renderItem={renderItem}
            />
            <ActionSheet id={KEYs.ACTION_SHEET.REASON_REPORT_PD_SHEET} drawUnderStatusBar={Platform.OS == 'ios'} onBeforeShow={setItemVisibility} >
                <SafeAreaView style={styles.contentReasonList}>
                    <Text style={styles.titleHeadReason}>{`${itemVisibility.ItemName}`}</Text>
                    <CustomListView
                        data={itemVisibility.dataReason}
                        extraData={[itemVisibility]}
                        renderItem={renderItemReason}
                    />
                </SafeAreaView>
            </ActionSheet>
        </View>
    )
}

export default EDIT_VisibilityScreen;