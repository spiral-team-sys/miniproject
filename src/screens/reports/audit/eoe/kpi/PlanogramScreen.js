import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import useTheme from "../../../../../hooks/useTheme";
import { fontWeightBold } from "../../../../../utils/utility";
import CustomListView from "../../../../../components/lists/CustomListView";
import { Text } from "@rneui/themed";
import { formatNumber, removeFormatNumber } from "../../../../../utils/helper";
import FieldFloatAction from "../../../../../components/fields/FieldFloatAction";
import _ from 'lodash';
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import FieldInput from "../../../../../components/fields/FieldInput";
import FastImage from "react-native-fast-image";

const PlanogramScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataPlanogram, setDataPlanogram] = useState([])
    const [input, setInput] = useState({ type: '', keyValue: '', item: {}, index: null })
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    const inputRef = useRef()
    //
    const LoadData = () => {
        setDataPlanogram(data)
    }
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataPlanogram)
        setDataPlanogram(dataUpdate || dataPlanogram)
        callBackData(itemMain)
    }
    // Handler
    const handlerInputValue = (type, item, index) => {
        try {
            listRef.current.scrollToIndex({ index: index, animated: true })
        } catch (e) {
            console.log('handlerInputValue: ', e);
        }
        // 
        input.type = type
        input.keyValue = input.keyValue = (type == 'HBL') ? 'HBLValue' : 'CompetitorValue'
        input.item = item
        input.index = index
        setMutate(e => !e)
        //
        if (index !== input.index)
            inputRef.current?.blur()
        setTimeout(() => {
            inputRef?.current?.focus()
        }, 100)
    }
    const handlerEndEditing = () => {
        setInput({ type: '', keyValue: '', item: {}, index: null })
    }
    const onEditing = (item) => {
        input.item = item
        setMutate(e => !e)
        //
        const dataUpdate = _.map(dataPlanogram, (e) => {
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
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, paddingBottom: 8 },
        viewFieldAction: { width: '100%', paddingTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
        inputView: { width: '30%', backgroundColor: appColors.cardColor, alignItems: 'center', alignSelf: 'center', borderRadius: 5, paddingVertical: 5, marginStart: 8 },
        labelInput: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor, fontStyle: 'italic' },
        valueInput: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.subTextColor, fontStyle: 'italic' },
        imageStyle: { width: '100%', height: 150, alignItems: "center", marginBottom: 8 },
        inputContainer: { width: '100%', height: 38, backgroundColor: appColors.cardColor, borderRadius: 5 },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })
    const renderItem = ({ item, index }) => {
        const onInputQuantity = (text) => {
            item.HBLValue = removeFormatNumber(text)
            onEditing(item)
        }
        const onInputCompetitor = (text) => {
            item.CompetitorValue = removeFormatNumber(text)
            onEditing(item)
        }
        const quantityValue = item.HBLValue || null
        const competitorValue = item.CompetitorValue || null
        return (
            <View style={styles.itemMain}>
                <View style={styleDefault.contentItemMain}>
                    <Text style={styles.titleName}>{`${index + 1}. ${item.ItemName}`}</Text>
                    {(item.PhotoPath || null) !== null &&
                        <FastImage
                            source={{ uri: item.PhotoPath, priority: 'low' }}
                            style={styles.imageStyle}
                            placeholderStyle={{ backgroundColor: 'transparent' }}
                            resizeMode="contain"
                            resizeMethod="resize"
                        />
                    }
                    {item.isInputValue == 1 &&
                        <View View style={styles.viewFieldAction}>
                            <View style={{ width: '50%' }}>
                                <FieldInput
                                    placeholder="HVN"
                                    keyboardType='numeric'
                                    disabled={isUploaded}
                                    value={formatNumber(quantityValue, ',')}
                                    onChangeText={onInputQuantity}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <FieldInput
                                    placeholder="HVN + Đối thủ"
                                    keyboardType='numeric'
                                    disabled={isUploaded}
                                    value={formatNumber(competitorValue, ',')}
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
                data={dataPlanogram}
                extraData={[dataPlanogram]}
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

export default PlanogramScreen;