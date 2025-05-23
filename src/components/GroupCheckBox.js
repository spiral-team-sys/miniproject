import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import useTheme from "../hooks/useTheme";
import { Text } from "@rneui/themed";

const GroupCheckBox = ({ title1, title2, itemMain, isUploaded = false, enabled = false, contentStyle, onPress }) => {
    const { appColors } = useTheme()
    const [value, setValue] = useState(null)

    const LoadData = () => {
        setValue(itemMain.DisplayValue)
    }
    // Handler
    const handlerChooseItem = (value) => {
        setValue(value)
        onPress(value)
    }
    const onYesPress = () => {
        handlerChooseItem(value == 1 ? null : 1)
    }
    const onNoPress = () => {
        handlerChooseItem(value == 0 ? null : 0)
    }
    //
    useEffect(() => {
        LoadData()
    }, [itemMain])
    // View
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', backgroundColor: appColors.backgroundColor },
        contentMain: { paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'center' },
        titleName: { fontSize: 12, fontWeight: '500', color: appColors.textColor, fontStyle: 'italic', textAlign: 'center', paddingVertical: Platform.OS == 'android' ? 5 : 8 },
        actionYes: {
            backgroundColor: value == 1 ? appColors.warningColor : appColors.cardColor,
            borderColor: value == 1 ? appColors.warningColor : appColors.borderColor,
            width: '50%', borderRadius: 5, borderWidth: 1, marginHorizontal: 4,
            elevation: 3, shadowColor: appColors.shadowColor, shadowOpacity: 0.3, shadowOffset: { width: 1, height: 1 }
        },
        actionNo: {
            backgroundColor: value == 0 ? appColors.warningColor : appColors.cardColor,
            borderColor: value == 0 ? appColors.warningColor : appColors.borderColor,
            width: '50%', borderRadius: 5, borderWidth: 1, marginHorizontal: 4,
            elevation: 3, shadowColor: appColors.shadowColor, shadowOpacity: 0.3, shadowOffset: { width: 1, height: 1 }
        },
    })
    if (!enabled) return <View />
    return (
        <View style={styles.mainContainer}>
            <View style={[styles.contentMain, contentStyle]}>
                <TouchableOpacity style={styles.actionYes} onPress={onYesPress} disabled={isUploaded}>
                    <Text allowFontScaling={false} style={styles.titleName}>{title1 || 'Có'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionNo} onPress={onNoPress} disabled={isUploaded}>
                    <Text allowFontScaling={false} style={styles.titleName}>{title2 || 'Không'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default GroupCheckBox;