import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { KEYs } from "../../../utils/storageKeys";
import { formatNumber, removeFormatNumber } from "../../../utils/helper";
import FieldInput from "../../fields/FieldInput";
import useTheme from "../../../hooks/useTheme";

const ItemMultipleInput = ({ itemMain, indexMain, keyboardType, multiline, disabled = false }) => {
    const { appColors } = useTheme()
    const [answerValue, setAnswerValue] = useState(null)
    const [answerValue2, setAnswerValue2] = useState(null)
    const [itemSurvey, setItemSurvey] = useState({})
    //
    const UpdateRawInfo = (info) => {
        setAnswerValue(info.AnswerValue)
        setAnswerValue2(info.AnswerValue2)
        DeviceEventEmitter.emit(`${KEYs.DEVICE_EVENT.UDPATE_DATA_RAW_SURVEY}_${indexMain}`, info)
    }

    const handlerChangeQuantity = (text) => {
        let value = removeFormatNumber(text)
        itemSurvey.AnswerValue = value
        itemSurvey.AnswerValue2 = value == 0 ? null : itemSurvey.AnswerValue2
        UpdateRawInfo(itemSurvey)
    }

    const handlerChangePrice = (text) => {
        let value = removeFormatNumber(text)
        itemSurvey.AnswerValue2 = value
        UpdateRawInfo(itemSurvey)
    }
    useEffect(() => {
        const onValueChange = () => {
            setAnswerValue(itemMain.AnswerValue)
            setAnswerValue2(itemMain.AnswerValue2)
            setItemSurvey(itemMain)
        }
        onValueChange()
    }, [itemSurvey])

    //
    const styles = StyleSheet.create({
        inputContainerStyle: { width: '100%', height: 38, borderRadius: 5, backgroundColor: itemMain.isValidMin ? appColors.warningColor : appColors.backgroundColor },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })
    return (
        <View style={styles.itemContainer}>
            <FieldInput
                disabled={disabled}
                value={formatNumber(answerValue, ',')}
                placeholder='Số lượng'
                multiline={multiline}
                keyboardType={keyboardType}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                onChangeText={handlerChangeQuantity}
            />
            <FieldInput
                disabled={disabled || (answerValue || 0) == 0}
                value={formatNumber(answerValue2, ',')}
                placeholder='Giá'
                multiline={multiline}
                keyboardType={keyboardType}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                onChangeText={handlerChangePrice}
            />
        </View>
    )
}
export default ItemMultipleInput;