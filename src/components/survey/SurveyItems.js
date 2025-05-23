import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import useTheme from "../../hooks/useTheme";
import { KEYs } from "../../utils/storageKeys";
import ItemInput from "./answer/ItemInput";
import ItemChoose from "./answer/ItemChoose";
import { REPORT_CONTROLLER } from "../../controllers/ReportController";
import ItemMultipleInput from "./answer/ItemMultipleInput";
import { isValidField } from "../../utils/validateData";
import _ from 'lodash';
import { fontWeightBold } from "../../utils/utility";
import ItemDate from "./answer/ItemDate";
import ItemAudio from "./answer/ItemAudio";

const SurveyItems = ({ item, index, dataMain, isUploaded = false, disable = false, onChangeData }) => {
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const { appColors } = useTheme()
    //
    const handlerUpdateRaw = async (itemUpdate) => {
        const dataUpdate = _.map(dataMain, (e) => { return e.Id == itemUpdate.Id ? itemUpdate : e })
        if (onChangeData) {
            onChangeData(dataUpdate)
        } else {
            await REPORT_CONTROLLER.UpdateDataRaw(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, dataUpdate)
        }
    }
    //
    useEffect(() => {
        const update_item_survey = DeviceEventEmitter.addListener(`${KEYs.DEVICE_EVENT.UDPATE_DATA_RAW_SURVEY}_${index}`, handlerUpdateRaw)
        return () => {
            update_item_survey.remove()
        }
    }, [item])
    //  
    const isBorderView = [KEYs.ANSWER_TYPE.NUMBER, KEYs.ANSWER_TYPE.FLOAT, KEYs.ANSWER_TYPE.DATE].includes(item.ItemType)
    const containerName = isBorderView ? 'borderView' : 'itemContainer'
    const styles = StyleSheet.create({
        itemContainer: { flex: 1 },
        titleGroup: { width: isBorderView ? '70%' : '100%', fontWeight: fontWeightBold, color: appColors.textColor, fontSize: 13, fontStyle: 'italic' },
        actionContent: { backgroundColor: appColors.backgroundColor, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
        actionContentSelected: { flex: 1, margin: 8, backgroundColor: appColors.backgroundColor, borderRadius: 8, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, elevation: 3, shadowOpacity: 0.5, borderWidth: 1, borderColor: appColors.borderColor, overflow: 'hidden' },
        borderView: { marginHorizontal: 8, backgroundColor: appColors.backgroundColor, borderRadius: 8, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, elevation: 3, shadowOpacity: 0.5, borderBottomWidth: 1, borderColor: appColors.borderColor, overflow: 'hidden' },
        inputContainerStyle: { width: '30%' },
        inputTextContainer: { marginTop: 8, width: '100%' }
    })
    const renderAnswerItem = () => {
        switch (item.ItemType) {
            case KEYs.ANSWER_TYPE.AUDIO:
                return <ItemAudio
                    disabled={isUploaded}
                    itemMain={item} />
            case KEYs.ANSWER_TYPE.TEXT:
                return (
                    <View style={styles.actionContent}>
                        <ItemInput
                            key={`TEXT_${index}`}
                            multiline
                            disabled={isUploaded}
                            placeholder={item.Unit || 'Nhập'}
                            itemMain={item}
                            indexMain={index}
                            inputContainerStyle={styles.inputTextContainer}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.NUMBER:
                return (
                    <View style={styles.actionContent}>
                        <Text style={styles.titleGroup}>{`${item.ItemName}`}</Text>
                        <ItemInput
                            key={`NUMBER_${index}`}
                            disabled={isUploaded}
                            keyboardType='numeric'
                            placeholder={item.Unit || 'Nhập'}
                            itemMain={item}
                            indexMain={index}
                            inputContainerStyle={styles.inputContainerStyle}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.FLOAT:
                return (
                    <View style={styles.actionContent}>
                        <Text style={styles.titleGroup}>{`${item.ItemName}`}</Text>
                        <ItemInput
                            key={`NUMBER_${index}`}
                            disabled={isUploaded}
                            keyboardType='numeric'
                            placeholder={item.Unit || 'Nhập'}
                            itemMain={item}
                            indexMain={index}
                            inputContainerStyle={styles.inputContainerStyle}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.QUANTITY_PRICE:
                return (
                    <View style={styles.actionContent}>
                        <ItemMultipleInput
                            key={`QUANTITY_PRICE_${index}`}
                            disabled={isUploaded}
                            keyboardType='numeric'
                            itemMain={item}
                            indexMain={index}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.BOOLEAN:
                return (
                    <View style={styles.actionContentSelected}>
                        <ItemChoose
                            key={`BOOLEAN_${index}`}
                            disabled={isUploaded}
                            itemMain={item}
                            indexMain={index}
                            placeholder={'Nhập'}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.CHECKBOX:
                return (
                    <View style={styles.actionContentSelected}>
                        <ItemChoose
                            key={`CHECKBOX_${index}`}
                            disabled={isUploaded}
                            isMultiple
                            itemMain={item}
                            indexMain={index}
                            placeholder={'Nhập'}
                        />
                    </View>
                )
            case KEYs.ANSWER_TYPE.DATE:
                return (
                    <View style={{ ...styles.actionContent, marginStart: 0 }}>
                        <ItemDate
                            key={`DATE_${index}`}
                            disabled={isUploaded}
                            placeholder={item.Unit || 'Nhập'}
                            itemMain={item}
                            indexMain={index} />
                    </View>
                )
            default:
                return <View />
        }
    }
    if (disable) return <View />
    return (
        <View style={styles[containerName]}>
            {!isBorderView && isValidField(item.ItemName) && <Text style={styles.titleGroup}>{`${item.ItemName}`}</Text>}
            {renderAnswerItem()}
        </View>
    )
}
export default SurveyItems;