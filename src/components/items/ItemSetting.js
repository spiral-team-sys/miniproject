import React from "react";
import useTheme from "../../hooks/useTheme";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Switch, Text } from "@rneui/themed";
import appConfig from "../../utils/appConfig/appConfig";
import { fontWeightBold } from "../../utils/utility";

const ItemSetting = ({ title, subTitle, iconLefName, iconRightName, isSwitch = false, valueChange, onPress, onSwitchChange }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        itemMain: { padding: 12, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: appColors.borderColor },
        contentTitle: { flexGrow: 1 },
        titleName: { fontSize: 13, marginLeft: 12, fontWeight: fontWeightBold, color: appColors.textColor },
        subTitleName: { width: '80%', fontSize: 11, marginLeft: 12, fontWeight: '500', color: appColors.subTextColor },
        switchStyle: Platform.OS == 'ios' ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}
    })

    return (
        <TouchableOpacity onPress={onPress} style={styles.itemMain}>
            {iconLefName && <Icon type={appConfig.ICON_TYPE} name={iconLefName} color={appColors.primaryColor} size={24} />}
            <View style={styles.contentTitle}>
                <Text style={styles.titleName}>{`${title}`}</Text>
                {subTitle && <Text style={styles.subTitleName}>{`${subTitle}`}</Text>}
            </View>
            {iconRightName && <Icon type={appConfig.ICON_TYPE} name={iconRightName} color={appColors.subTextColor} size={16} />}
            {isSwitch && <Switch
                onChange={onSwitchChange || onPress}
                color={appColors.primaryColor}
                value={valueChange}
                style={styles.switchStyle} />
            }
        </TouchableOpacity>
    )
}

export default ItemSetting;