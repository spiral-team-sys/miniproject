import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { KEYs } from "../../../utils/storageKeys";
import { formatDecimal, formatNumber, removeFormatNumber } from "../../../utils/helper";
import FieldInput from "../../fields/FieldInput";
import useTheme from "../../../hooks/useTheme";
import { isValidField, isValidNumber } from "../../../utils/validateData";

const ItemInput = ({ itemMain, indexMain, keyboardType, placeholder, multiline, disabled = false, inputContainerStyle }) => {
    const { appColors } = useTheme()
    const [answerValue, setAnswerValue] = useState(null)
    const [itemSurvey, setItemSurvey] = useState({})
    const [_mutate, setMutate] = useState(false)
    //
    const UpdateRawInfo = (info) => {
        setAnswerValue(info.AnswerValue)
        DeviceEventEmitter.emit(`${KEYs.DEVICE_EVENT.UDPATE_DATA_RAW_SURVEY}_${indexMain}`, info)
    }

    const handlerChangeText = (text) => {
        let value = text
        if (itemMain.ItemType == KEYs.ANSWER_TYPE.NUMBER) {
            value = removeFormatNumber(text)
        }
        if (itemMain.ItemType == KEYs.ANSWER_TYPE.FLOAT) {
            value = formatDecimal(text)
        }
        //
        itemSurvey.AnswerValue = value
        onCheckValidMin(text)
        UpdateRawInfo(itemSurvey)
    }

    const onCheckValidMin = (text) => {
        if (text !== '0') {
            if (isValidNumber(itemMain.Min) && itemMain.ItemType == KEYs.ANSWER_TYPE.NUMBER && isValidField(text)) {
                itemMain.isValidMin = isValidField(itemMain.AnswerValue) && +itemMain.AnswerValue < +itemMain.Min
            } else {
                itemMain.isValidMin = false
            }
        } else {
            itemMain.isValidMin = false
        }
        setMutate(e => !e)
    }

    useEffect(() => {
        const onValueChange = () => {
            setAnswerValue(itemMain.AnswerValue)
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
        <FieldInput
            disabled={disabled}
            value={itemMain.ItemType == KEYs.ANSWER_TYPE.NUMBER ? formatNumber(answerValue, ',') : answerValue}
            placeholder={placeholder}
            multiline={multiline}
            keyboardType={keyboardType}
            inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle]}
            inputStyle={styles.inputStyle}
            onChangeText={handlerChangeText}
        />
    )
}
export default ItemInput;