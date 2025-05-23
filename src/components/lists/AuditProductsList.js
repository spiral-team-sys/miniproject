import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import useTheme from "../../hooks/useTheme";
import CustomListView from "./CustomListView";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Text } from "@rneui/themed";
import { deviceHeight } from "../../styles/styles";
import { fontWeightBold } from "../../utils/utility";
import FieldFloatAction from "../fields/FieldFloatAction";
import FieldAreaList from "../fields/eoe/FieldAreaList";
import FieldPOSMList from "../fields/eoe/FieldPOSMList";
import ItemAuditProducts from "../items/ItemAuditProducts";
import { isValidData, isValidField } from "../../utils/validateData";
import _ from 'lodash';

const AuditProductsList = ({ typeMain, itemMain, dataMain, data, isUploaded = false, itemShowImage = true, onSaveItem }) => {
    const { appColors } = useTheme()
    const [isLoading, setLoading] = useState(true)
    const [dataProducts, setDataProducts] = useState([])
    const [input, setInput] = useState({ type: '', keyValue: '', item: {}, index: null })
    const [_mutate, setMutate] = useState(false)
    const [itemSheet, setItemSheet] = useState({})
    const listRef = useRef()
    const inputRef = useRef()
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        await setDataProducts(data)
        await setLoading(false)
    }
    // Handler 
    const handlerAreaValue = (type, item, index) => {
        const itemSheet = {
            ...item,
            isUploaded,
            index,
            dataProducts,
            itemMain
        }
        const sheetId = type == 'POSM' ? `posm-${typeMain}-sheet` : `area-${typeMain}-sheet`
        SheetManager.show(sheetId, { payload: itemSheet })
    }
    const handlerInputValue = (type, item, index) => {
        try {
            listRef.current.scrollToIndex({ index: index, animated: true })
        } catch (e) {
            console.log('handlerInputValue: ', e);
        }
        //  
        input.type = type
        input.keyValue = (type == 'PRICE') ? 'PriceValue' : 'QuantityValue'
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
    const handlerDisplayValue = (value, item, index) => {
        const _value = value == (item.DisplayValue || null) ? null : value
        item.DisplayValue = _value
        item.QuantityValue = _value !== 1 ? null : item.QuantityValue
        //
        if ((item.isInputValue || 0) == 1) {
            if (item.isArea == 0) {
                (_value == 1 ?
                    handlerInputValue('QUANTITY', item, index)
                    :
                    handlerInputValue(null, {}, index))
            } else {
                if (_value == 1) handlerAreaValue('AREA', item, index)
                handlerEndEditing()
                setMutate(e => !e)
            }
        } else if (item.isPOSM == 1 && _value == 1) {
            handlerAreaValue('POSM', item, index)
            setMutate(e => !e)
        } else {
            setMutate(e => !e)
        }
        //
        onSaveItem()
    }
    const handlerEndEditing = () => {
        setInput({ type: '', keyValue: '', item: {}, index: null })
    }
    const onEditing = (item) => {
        input.item = item
        setMutate(e => !e)
        //
        const dataUpdate = _.map(dataMain, (e) => e.ProductId === item.ProductId ? item : e);
        if (isValidData(dataUpdate))
            onSaveItem(dataUpdate)
    }
    const handlerCloseArea = async (item) => {
        const _mapData = _.map(dataMain, (e) => {
            const totalQuanityArea = _.sumBy(JSON.parse(itemSheet.JsonArea || '[]'), 'QuantityValue');
            return (e.ProductId == itemSheet.ProductId) ? { ...e, JsonArea: itemSheet.JsonArea, QuantityValue: totalQuanityArea } : e
        })
        const productList = _.filter(_mapData, (e) => e.isChooseTag == 1)
        await setDataProducts(productList)
        await onSaveItem(_mapData)
    }
    const handlerClosePOSM = async () => {
        const _mapData = _.map(dataMain, (e) => {
            return (e.ProductId == itemSheet.ProductId) ? { ...e, JsonPOSM: itemSheet.JsonPOSM } : e
        })
        const productList = _.filter(_mapData, (e) => e.isChooseTag == 1)
        await setDataProducts(productList)
        await onSaveItem(_mapData)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (isMounted)
            LoadData();
        return () => { isMounted = false }
    }, [data])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        areaSheetView: { width: '100%', height: deviceHeight / 2 },
        titleActionHead: { width: '100%', padding: 8, fontSize: 15, fontWeight: fontWeightBold, color: appColors.primaryColor, textAlign: 'center' },
        bottomView: { paddingBottom: deviceHeight / (Platform.OS == 'android' ? 3 : 2.8) }
    })
    const renderItem = ({ item, index }) => (
        <ItemAuditProducts
            item={item}
            itemMain={itemMain}
            index={index}
            input={input}
            appColors={appColors}
            isUploaded={isUploaded}
            isShowImage={isValidField(item.PhotoPath) && itemShowImage}
            handlerAreaValue={handlerAreaValue}
            handlerDisplayValue={handlerDisplayValue}
            handlerEndEditing={handlerEndEditing}
            handlerInputValue={onEditing}
        />
    )
    if (isLoading) return <ActivityIndicator size='small' color={appColors.lightColor} />
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                ref={listRef}
                data={dataProducts}
                extraData={[input, dataProducts]}
                numColumns={2}
                renderItem={renderItem}
                bottomView={styles.bottomView}
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
            <ActionSheet id={`area-${typeMain}-sheet`} keyboardShouldPersistTaps="handled" onBeforeShow={setItemSheet} onBeforeClose={handlerCloseArea} >
                <View style={styles.areaSheetView}>
                    <Text style={styles.titleActionHead}>{itemSheet.ProductName}</Text>
                    <FieldAreaList
                        itemMain={itemSheet}
                        isUploaded={itemSheet.isUploaded}
                    />
                </View>
            </ActionSheet>
            <ActionSheet id={`posm-${typeMain}-sheet`} keyboardShouldPersistTaps="handled" onBeforeShow={setItemSheet} onBeforeClose={handlerClosePOSM} >
                <View style={styles.areaSheetView}>
                    <Text style={styles.titleActionHead}>{itemSheet.ProductName}</Text>
                    <FieldPOSMList
                        itemMain={itemSheet}
                        isUploaded={itemSheet.isUploaded}
                    />
                </View>
            </ActionSheet>
        </View>
    )
}
export default AuditProductsList;