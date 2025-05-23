import React from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "@rneui/themed";
import appConfig from "../../utils/appConfig/appConfig";

export const NoData = ({ onRefresh, isCheckData = false }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        mainContainer: { position: 'absolute', top: 0, end: 0, start: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
        titleName: { fontSize: 12, fontWeight: '500', color: appColors.primaryColor, padding: 8 }
    })

    if (!isCheckData) return <View />

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={onRefresh}>
            <Text style={styles.titleName}>Dữ liệu trống bấm để làm mới dữ liệu</Text>
            <Icon type={appConfig.ICON_TYPE} name='refresh' color={appColors.primaryColor} size={24} />
        </TouchableOpacity>
    )
}