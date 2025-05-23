import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from "../../hooks/useTheme";
import FieldInput from "./FieldInput";
import { fontWeightBold } from "../../utils/utility";
import { deviceHeight } from "../../styles/styles";

const FieldFloatAction = forwardRef((props, ref) => {
    const { type, item, keyValue, index, onEditing, handlerEndEditing, containerStyle, isUploaded = false } = props
    const { appColors } = useTheme()
    const [itemUpdate, setItemUdpate] = useState({})
    const [typeAction, setTypeAction] = useState(false)
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus: () => { inputRef.current?.focus() },
        blur: () => { inputRef.current?.blur() }
    }));
    //
    const LoadData = async () => {
        await setItemUdpate(item)
        await setTypeAction(type)
    }
    // Handler
    const onChangeText = (text) => {
        switch (type) {
            case 'PRICE':
                item.PriceValue = text
                break
            case 'QUANTITY':
                item.QuantityValue = text
                break
            case 'HBL':
                item.HBLValue = text
                break
            case 'COMPETITOR':
                item.CompetitorValue = text
                break
            case 'NOTE':
                item.Note = text
                break
        }
        onEditing(item)
    }
    const onEndInput = () => {
        if (type !== null && type.length > 0) {
            setItemUdpate({})
            setTypeAction(null)
            handlerEndEditing()
        }
    }
    //
    useEffect(() => {
        LoadData()
    }, [item, type])

    // View
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', padding: 8, position: 'absolute', bottom: deviceHeight / (Platform.OS == 'android' ? 12 : 7), backgroundColor: appColors.backgroundColor, zIndex: 10000 },
        inputContainer: { width: '100%', backgroundColor: appColors.darkColor },
        containerInputStyle: { backgroundColor: appColors.textColor },
        inputStyle: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.lightColor }
    })
    return (
        type !== null && type.length > 0 &&
        <SafeAreaView key={`${type}_${index}_${itemUpdate.ProductId}`} style={[styles.mainContainer, containerStyle]}>
            <FieldInput
                ref={inputRef}
                keyboardType={typeAction == "NOTE" ? "default" : "numeric"}
                defaultValue={Object.keys(itemUpdate).length > 0 && (itemUpdate[keyValue] || '').toString()}
                placeholder={typeAction == "NOTE" ? `Ghi chú` : `${itemUpdate?.ProductName || itemUpdate?.ItemName || ''}`}
                inputContainerStyle={styles.inputContainer}
                style={styles.containerInputStyle}
                inputStyle={styles.inputStyle}
                onChangeText={onChangeText}
                onEndEditing={onEndInput}
                onSubmitEditing={onEndInput}
            />
        </SafeAreaView >
    )
})
export default FieldFloatAction;