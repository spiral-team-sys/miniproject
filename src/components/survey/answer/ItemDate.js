import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { KEYs } from "../../../utils/storageKeys";
import DateChoose from "../../datetime/DateChoose";
import FieldCheckBox from "../../fields/FieldCheckBox";
import useTheme from "../../../hooks/useTheme";
import { fontWeightBold } from "../../../utils/utility";

const ItemDate = ({ itemMain, indexMain, disabled = false }) => {
    const { appColors } = useTheme()
    const [answerValue, setAnswerValue] = useState(null)
    const [itemSurvey, setItemSurvey] = useState({})
    //
    const UpdateRawInfo = (info) => {
        setAnswerValue(info.AnswerValue)
        DeviceEventEmitter.emit(`${KEYs.DEVICE_EVENT.UDPATE_DATA_RAW_SURVEY}_${indexMain}`, info)
    }
    const handlerChangeText = (text) => {
        itemSurvey.AnswerValue = text
        UpdateRawInfo(itemSurvey)
    }
    const handlerCheckNo = () => {
        itemSurvey.AnswerValue = itemSurvey.AnswerValue == '0' ? null : '0'
        UpdateRawInfo(itemSurvey)
    }
    //
    useEffect(() => {
        const onValueChange = () => {
            setAnswerValue(itemMain.AnswerValue)
            setItemSurvey(itemMain)
        }
        onValueChange()
    }, [itemSurvey])
    // 
    const styles = StyleSheet.create({
        itemMainContainer: { flexDirection: 'row', alignItems: 'center' },
        titleGroup: { width: '70%', fontWeight: fontWeightBold, color: appColors.textColor, fontSize: 13, fontStyle: 'italic' },
        dateContainer: { width: '30%' }
    })
    return (
        <View style={styles.itemMainContainer}>
            <FieldCheckBox
                title={itemMain.ItemName}
                disabled={disabled}
                checked={answerValue === '0'}
                checkedColor={appColors.errorColor}
                checkedIcon="close-circle"
                uncheckedIcon="close-circle-outline"
                textStyle={styles.titleGroup}
                onPress={handlerCheckNo}
            />
            <DateChoose
                disabled={disabled}
                value={answerValue == '0' ? ' ' : (answerValue || itemMain.Unit)}
                containerStyle={styles.dateContainer}
                onChooseDate={handlerChangeText}
            />
        </View>
    )
}
export default ItemDate;