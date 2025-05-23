import React, { useEffect, useRef, useState, useCallback } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import CustomListView from "../../lists/CustomListView";
import useTheme from "../../../hooks/useTheme";
import FieldInput from "../../fields/FieldInput";
import { isValidField } from "../../../utils/validateData";

const FieldAreaList = ({ isUploaded = false, itemMain }) => {
    const { appColors } = useTheme()
    const [dataArea, setDataArea] = useState([])
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    const inputRef = useRef([])
    //
    const LoadData = useCallback(() => {
        const _data = JSON.parse(itemMain.JsonArea || '[]')
        setDataArea(_data)
    }, [itemMain])

    // Handler
    const handlerChangeValue = useCallback((item, text) => {
        item.QuantityValue = isValidField(text) ? parseInt(text) : text
        itemMain.JsonArea = JSON.stringify(dataArea)
        setMutate(e => !e)
    }, [dataArea, itemMain])

    const handlerEndEditing = useCallback((index) => {
        try {
            if ((index + 1) < dataArea.length) {
                inputRef.current[index + 1].focus()
            } else {
                inputRef.current[index].blur()
            }
        } catch (e) {
            console.log('handlerEndEditing: ', e);
        }
    }, [dataArea])
    //
    useEffect(() => {
        let isMounted = true
        if (isMounted)
            LoadData()
        return () => { isMounted = false }
    }, [LoadData])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        itemMain: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 8, paddingBottom: 0, borderBottomWidth: 0.5, borderBottomColor: appColors.borderColor },
        titleName: { width: '70%', fontSize: 14, fontWeight: Platform.OS == 'android' ? '600' : '500' },
        inputContainer: { width: '28%', height: 38 },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })

    const renderItem = ({ item, index }) => {
        const onChangeText = (text) => {
            handlerChangeValue(item, text)
        }
        const onEndInput = () => {
            handlerEndEditing(index)
        }
        const quantityValue = item.QuantityValue !== undefined && item.QuantityValue !== null ? item.QuantityValue : ''

        return (
            <View key={`ali_${index}`} style={styles.itemMain}>
                <Text style={styles.titleName}>{item.ItemName}</Text>
                <FieldInput
                    ref={(e) => inputRef.current[index] = e}
                    allowFontScaling={false}
                    disabled={isUploaded}
                    placeholder='Số lượng'
                    defaultValue={`${quantityValue}`}
                    keyboardType="numeric"
                    returnKeyType="next"
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputStyle}
                    onChangeText={onChangeText}
                    onSubmitEditing={onEndInput}
                />
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <CustomListView
                ref={listRef}
                data={dataArea}
                renderItem={renderItem}
            />
        </View>
    )
}

export default FieldAreaList;
