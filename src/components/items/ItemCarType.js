import React from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@rneui/base";
import { fontWeightBold } from "../../utils/utility";

const ItemCarType = ({ value, title, onPress }) => {
    const { appColors } = useTheme()

    const handlerPressItem = () => {
        onPress(value)
    }

    const styles = StyleSheet.create({
        mainContainer: { width: '100%' },
        titleView: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8, marginBottom: 8 }
    })

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={handlerPressItem}>
            <Text allowFontScaling={false} style={styles.titleView}>{title || ''}</Text>
        </TouchableOpacity>
    )
}

export default ItemCarType;