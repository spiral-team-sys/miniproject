import React from "react";
import { Icon, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import useTheme from "../hooks/useTheme";
import appConfig from "../utils/appConfig/appConfig";
import { fontWeightBold } from "../utils/utility";

const Header = ({ title, subTitle, iconNameLeft, backgroundColor, iconNameRight, onLeftPress, onRightPress, iconNameMiddle, onMiddlePress, disabledRight, textColor }) => {
    const { appColors } = useTheme()
    //
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundColor || appColors.transparent },
        contentLeft: { width: '15%', justifyContent: 'center' },
        contentCenter: { width: '70%', justifyContent: 'center', alignItems: 'center' },
        contentRight: { width: '15%', justifyContent: 'center' },
        titleStyle: { fontSize: 13, textAlign: 'center', fontWeight: fontWeightBold, color: textColor || appColors.lightColor, textTransform: 'uppercase' },
        subTitleStyle: { fontSize: 11, fontWeight: '500', color: textColor || appColors.lightColor, textAlign: 'center', paddingHorizontal: 8 },
        actionLeft: { padding: 8 },
        actionRight: { padding: 8 },
        actionMiddle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
    })

    return (
        <View style={styles.mainContainer}>
            <View style={styles.contentLeft}>
                {onLeftPress &&
                    <TouchableOpacity style={styles.actionLeft} onPress={onLeftPress}>
                        <Icon type={appConfig.ICON_TYPE} name={iconNameLeft || 'arrow-back-outline'} color={textColor || appColors.lightColor} />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.contentCenter}>
                {onMiddlePress ?
                    <TouchableOpacity style={styles.actionMiddle} onPress={onMiddlePress}>
                        <Icon size={18} style={{ padding: 1 }} type={appConfig.ICON_TYPE} name={iconNameMiddle} color={textColor || appColors.lightColor} />
                        <Text allowFontScaling={false} style={styles.titleStyle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                    </TouchableOpacity>
                    :
                    title && <Text allowFontScaling={false} style={styles.titleStyle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                }
                {subTitle && <Text allowFontScaling={false} style={styles.subTitleStyle} numberOfLines={1} ellipsizeMode="tail">{subTitle}</Text>}
            </View>
            <View style={styles.contentRight}>
                {onRightPress &&
                    <TouchableOpacity style={styles.actionRight} onPress={onRightPress} disabled={disabledRight}>
                        <Icon type={appConfig.ICON_TYPE} name={iconNameRight || 'arrow-forward-outline'} color={textColor || appColors.lightColor} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default Header;