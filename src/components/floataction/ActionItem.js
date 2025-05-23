import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Icon, Text } from "@rneui/themed";
import useTheme from "../../hooks/useTheme";
import { fontWeightBold } from "../../utils/utility";
import appConfig from "../../utils/appConfig/appConfig";

const ActionItem = ({ isMain = false, badgeValue = null, backgroundColor, typeAction, title, iconName, iconColor, onPress }) => {
    const { appColors } = useTheme()
    //
    const onPressMenu = () => {
        onPress(typeAction, title)
    }
    const styles = StyleSheet.create({
        mainContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        viewActionMain: { width: 50, height: 50, justifyContent: 'center', margin: 5, padding: 8, borderWidth: 1, borderColor: appColors.borderColor, backgroundColor: backgroundColor || appColors.cardColor, shadowColor: appColors.shadowColor, elevation: 3, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, borderRadius: 50 },
        viewTitleName: { backgroundColor: appColors.backgroundColor, padding: 8, paddingHorizontal: 16, borderRadius: 50, shadowColor: appColors.shadowColor, elevation: 3, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2 },
        titleName: { fontSize: 13, color: isMain ? appColors.errorColor : appColors.textColor, fontWeight: fontWeightBold },
        titleBadge: { fontSize: 13, color: appColors.lightColor, fontWeight: '500' },
        viewBadge: { backgroundColor: 'transparent', borderWidth: 0 },
        badgeContainer: { width: 28, height: 28, backgroundColor: appColors.errorColor, justifyContent: 'center', borderRadius: 50, position: 'absolute', end: -5, top: 0 }
    })
    return (
        <View style={styles.mainContainer}>
            {title &&
                <View style={styles.viewTitleName}>
                    <Text allowFontScaling={false} style={styles.titleName}>{title || ''}</Text>
                </View>
            }
            <TouchableOpacity style={styles.viewActionMain} onPress={onPressMenu}>
                <Icon
                    type={appConfig.ICON_TYPE}
                    name={iconName || ''}
                    size={24}
                    color={isMain && title ? appColors.errorColor : (iconColor || appColors.primaryColor)} />
            </TouchableOpacity>
            {badgeValue !== null &&
                <Badge
                    value={badgeValue}
                    textStyle={styles.titleBadge}
                    badgeStyle={styles.viewBadge}
                    containerStyle={styles.badgeContainer}
                />
            }
        </View>
    )
}

export default ActionItem;