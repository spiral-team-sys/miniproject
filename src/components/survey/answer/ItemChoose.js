import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import useTheme from "../../../hooks/useTheme";
import appConfig from "../../../utils/appConfig/appConfig";
import { KEYs } from "../../../utils/storageKeys";
import FieldInput from "../../fields/FieldInput";
import _ from 'lodash';

const ItemChoose = ({ itemMain, indexMain, isMultiple = false, disabled = false, keyboardType, placeholder, multiline }) => {
    const { appColors } = useTheme()
    const [itemSurvey, setItemSurvey] = useState({})
    const [dataAnswer, setDataAnswer] = useState([])
    // 
    const LoadData = () => {
        setItemSurvey(itemMain)
        setDataAnswer(itemMain.JsonAnswer || [])
    }
    const UpdateRawInfo = (info) => {
        DeviceEventEmitter.emit(`${KEYs.DEVICE_EVENT.UDPATE_DATA_RAW_SURVEY}_${indexMain}`, info)
    }
    // Handler
    const handlerChoose = async (item) => {
        let itemUpdate = {}
        if (isMultiple)
            itemUpdate = onMultipleChoose(item)
        else
            itemUpdate = onOnlyChoose(item)
        //
        UpdateRawInfo(itemUpdate)
    }
    const onMultipleChoose = (item) => {
        let _dataUpdate = []
        item.isChoose = !(item.isChoose || false)
        if (item.isNo == 1) {
            _dataUpdate = _.map(dataAnswer, (e) => { return e.isNo == 0 ? { ...e, isChoose: false } : e })
        } else {
            _dataUpdate = _.map(dataAnswer, (e) => { return e.isNo == 1 ? { ...e, isChoose: false } : e })
        }
        itemSurvey.JsonAnswer = _dataUpdate
        setDataAnswer(_dataUpdate)
        return itemSurvey;
    }
    const onOnlyChoose = (item) => {
        const _dataUpdate = _.map(dataAnswer, (e) => {
            return e.AnswerId == item.AnswerId && e.ItemName == item.ItemName ?
                { ...e, isChoose: !(e.isChoose || false), AnswerValue: null }
                :
                { ...e, isChoose: false, AnswerValue: null }
        })
        const itemChoose = _.find(_dataUpdate, (e) => e.isChoose == true) || {}
        itemSurvey.JsonAnswer = _dataUpdate
        itemSurvey.AnswerValue = itemChoose?.ItemName || null
        setDataAnswer(_dataUpdate)
        return itemSurvey;
    }
    const handlerChangeText = (text, item) => {
        let value = text
        const _dataUpdate = _.map(dataAnswer, (e) => {
            if (e.ItemName === item.ItemName) {
                return { ...e, AnswerValue: value }
            } else {
                return { ...e, AnswerValue: null }
            }
        })
        itemSurvey.JsonAnswer = _dataUpdate
        UpdateRawInfo(itemSurvey)
    }
    // 
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [itemMain])
    // View
    const styles = StyleSheet.create({
        itemContainer: { width: '100%', padding: 6 },
        itemMainView: { width: '100%', borderBottomColor: appColors.borderColor, backgroundColor: appColors.lightColor },
        contentItem: { width: '100%', paddingVertical: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 },
        titleName: { width: '90%', fontSize: 13, fontWeight: '500', color: appColors.textColor },
        inputContainerStyle: { width: '100%', height: 38, borderRadius: 5, backgroundColor: appColors.backgroundColor },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })

    const renderItem = ({ item, index }) => {
        const onPress = () => handlerChoose(item)
        const iconChoose = item.isChoose ? "checkbox" : "square-outline"
        const iconColor = item.isChoose ? appColors.secondaryColor : appColors.darkColor
        const borderBottomWidth = (index + 1) == dataAnswer.length ? 0 : 1
        return (
            <View key={`itc_${index}`} style={{ ...styles.itemMainView, borderBottomWidth }}>
                <TouchableOpacity style={styles.contentItem} onPress={onPress} disabled={disabled}>
                    <Text style={styles.titleName}>{`${item.ItemName}`}</Text>
                    <Icon type={appConfig.ICON_TYPE} size={24} name={iconChoose} color={iconColor} />
                </TouchableOpacity>
                {item.isChoose && item.isNote == 1 &&
                    <FieldInput
                        disabled={disabled}
                        value={itemMain.ItemType == KEYs.ANSWER_TYPE.NUMBER ? formatNumber(item.AnswerValue, ',') : item.AnswerValue}
                        placeholder={placeholder}
                        multiline={multiline}
                        keyboardType={keyboardType}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        onChangeText={(e) => handlerChangeText(e, item)}
                    />
                }
            </View>
        )
    }

    return (
        <View style={styles.itemContainer}>
            <FlashList
                keyExtractor={(_it, idx) => idx.toString()}
                data={dataAnswer}
                extraData={[itemMain, dataAnswer]}
                estimatedItemSize={100}
                renderItem={renderItem}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ItemChoose;