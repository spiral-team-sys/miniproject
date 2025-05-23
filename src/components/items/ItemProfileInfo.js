import React from "react";
import useTheme from "../../hooks/useTheme";
import appConfig from "../../utils/appConfig/appConfig";
import { Icon, Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { fontWeightBold } from "../../utils/utility";

const ItemProfileInfo = ({ title, value, iconName }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        contentTitle: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 12 },
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, marginStart: 12 }
    })

    if (!value) return <View />
    return (
        <View style={styles.contentTitle}>
            <Icon type={appConfig.ICON_TYPE} name={iconName} color={appColors.primaryColor} style={styles.iconLeft} size={24} />
            <Text style={styles.titleName}>{title}{value}</Text>
        </View>
    )
}

export default ItemProfileInfo;