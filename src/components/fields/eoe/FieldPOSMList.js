import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import useTheme from "../../../hooks/useTheme";
import CustomListView from "../../lists/CustomListView";
import FieldCheckBox from "../../fields/FieldCheckBox";

const FieldPOSMList = ({ isUploaded = false, itemMain }) => {
    const { appColors } = useTheme()
    const [dataPOSM, setDataPOSM] = useState([])
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    //  
    const LoadData = () => {
        const _data = JSON.parse(itemMain.JsonPOSM || '[]')
        // console.log(itemMain.JsonPOSM, "posmList")
        setDataPOSM(_data)
    }
    // Handler
    const handlerChangeValue = (item) => {
        item.isChoose = !(item.isChoose || false)
        itemMain.JsonPOSM = JSON.stringify(dataPOSM)
        setMutate(e => !e)
    }
    //
    useEffect(() => {
        LoadData()
    }, [itemMain])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        itemMain: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 8, paddingBottom: 0, borderBottomWidth: 0.5, borderBottomColor: appColors.borderColor },
        titleName: { width: '70%', fontSize: 14, fontWeight: Platform.OS == 'android' ? '600' : '500' },
        inputContainer: { width: '28%', height: 38 },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            handlerChangeValue(item)
        }
        return (
            <View key={`ali_${index}`} style={styles.itemMain}>
                <FieldCheckBox
                    title={item.ItemName}
                    disabled={isUploaded}
                    checked={item.isChoose || false}
                    onPress={onPress}
                />
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                ref={listRef}
                data={dataPOSM}
                renderItem={renderItem}
            />
        </View>
    )
}
export default FieldPOSMList;