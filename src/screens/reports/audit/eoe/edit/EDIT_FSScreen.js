import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import useTheme from "../../../../../hooks/useTheme";
import { formatDecimal, groupDataByKey } from "../../../../../utils/helper";
import { deviceHeight } from "../../../../../styles/styles";
import { fontWeightBold } from "../../../../../utils/utility";
import appConfig from "../../../../../utils/appConfig/appConfig";
import { Icon, Text } from "@rneui/themed";
import CustomListView from "../../../../../components/lists/CustomListView";
import FieldFloatAction from "../../../../../components/fields/FieldFloatAction";
import GroupCheckBox from "../../../../../components/GroupCheckBox";
import FieldInput from "../../../../../components/fields/FieldInput";
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import _ from 'lodash';

const EDIT_FSScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataFS, setDataFS] = useState()
    const [input, setInput] = useState({ type: '', keyValue: '', item: {}, index: null })
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    const inputRef = useRef()
    //
    const LoadData = () => {
        const { arr } = groupDataByKey({
            arr: data,
            key: 'BrandId'
        })
        setDataFS(arr)
    }
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataFS)
        setDataFS(dataUpdate || dataFS)
        callBackData(itemMain)
    }
    // Handler
    const handlerDisplayValue = (value, item) => {
        const _value = value == (item.DisplayValue || null) ? null : value
        const dataUpdate = _.map(dataFS, (e) => { return { ...e, DisplayValue: _value } })
        setDataFS(dataUpdate)
        handlerSaveItem(dataUpdate)
    }
    const handlerEndEditing = () => {
        setInput({ type: '', keyValue: '', item: {}, index: null })
    }
    const onEditing = (item) => {
        input.item = item
        setMutate(e => !e)
        //
        const dataUpdate = _.map(dataFS, (e) => {
            return (e.ProductId == item.ProductId) ? item : e
        })
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

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, marginTop: 8 },
        itemMain: { width: '100%', padding: 8 },
        viewHeadGroup: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, paddingTop: 0 },
        titleGroup: { fontSize: 14, fontWeight: '700', color: appColors.textColor, fontStyle: 'italic', paddingStart: 6 },
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, paddingBottom: 8 },
        viewFieldAction: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', paddingTop: 8 },
        contentCheckBox: { width: '35%', alignSelf: 'flex-end' },
        bottomView: { paddingBottom: deviceHeight / 9 },
        inputView: { width: '48%', backgroundColor: appColors.cardColor, alignItems: 'center', alignSelf: 'center', borderRadius: 5, paddingVertical: 5 },
        labelInput: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor, fontStyle: 'italic' },
        valueInput: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.subTextColor, fontStyle: 'italic' },
        viewChooseValue: { width: '50%', justifyContent: 'center', alignSelf: 'flex-end' },
        imageStyle: { width: '100%', height: 150, alignItems: "center", marginBottom: 8 },
        inputContainer: { width: '100%', height: 38, backgroundColor: appColors.cardColor, borderRadius: 5 },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })
    const renderItem = ({ item, index }) => {
        const onInputHBL = (text) => {
            item.HBLValue = formatDecimal(text)
            onEditing(item)
        }
        const onInputCompetitor = (text) => {
            item.CompetitorValue = formatDecimal(text)
            onEditing(item)
        }
        const onCheckBoxPress = (value) => {
            handlerDisplayValue(value, item)
        }
        const hblValue = item.HBLValue || null
        const competitorValue = item.CompetitorValue || null
        return (
            <View key={`svi_${index}`} style={styles.itemMain}>
                {item.isParent && item.BrandName !== null && item.BrandName !== '' &&
                    <View style={styles.viewHeadGroup}>
                        <Icon type={appConfig.ICON_TYPE} name="ellipse" color={appColors.highlightDate} />
                        <Text style={styles.titleGroup}>{item.BrandName}</Text>
                    </View>
                }
                <View style={styleDefault.contentItemMain}>
                    <Text style={styles.titleName}>{`${index + 1}. ${item.ProductName}`}</Text>
                    {/* {(item.PhotoPath || null) !== null &&
                        <Image
                            source={{ uri: item.PhotoPath }}
                            style={styles.imageStyle}
                            placeholderStyle={{ backgroundColor: 'transparent' }}
                            resizeMode="contain"
                            resizeMethod="resize"
                        />
                    } */}
                    <View style={styles.viewChooseValue}>
                        <GroupCheckBox
                            enabled={item.isChooseValue == 1}
                            isUploaded={isUploaded}
                            itemMain={item}
                            onPress={onCheckBoxPress} />
                    </View>
                    {item.isInputValue == 1 && (item.isProductMainShelf == 1 || item.DisplayValue == 1) &&
                        <View View style={styles.viewFieldAction}>
                            <View style={{ width: '50%' }}>
                                <FieldInput
                                    placeholder="Số mét HBL"
                                    keyboardType='decimal-pad'
                                    disabled={isUploaded}
                                    value={`${hblValue}`}
                                    onChangeText={onInputHBL}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <FieldInput
                                    placeholder="Số mét đối thủ"
                                    keyboardType='decimal-pad'
                                    disabled={isUploaded}
                                    value={`${competitorValue}`}
                                    onChangeText={onInputCompetitor}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>
                        </View>
                    }
                </View>
            </View >
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
                data={dataFS}
                extraData={[dataFS]}
                renderItem={renderItem}
            />
            <FieldFloatAction
                ref={inputRef}
                type={input.type || ''}
                item={input.item || {}}
                index={input.index || null}
                keyValue={input.keyValue || ''}
                onEditing={onEditing}
                handlerEndEditing={handlerEndEditing}
            />
        </View>
    )
}

export default EDIT_FSScreen;