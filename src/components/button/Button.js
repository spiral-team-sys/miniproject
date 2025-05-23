import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon } from '@rneui/themed';
import useTheme from '../../hooks/useTheme';
import appConfig from '../../utils/appConfig/appConfig';
import { fontWeightBold } from '../../utils/utility';

const Button = ({ title, iconName, iconColor, onPress, style, textStyle, isTitleButton = false, disabled = false, visible = true, loading = false }) => {
    const { appColors } = useTheme()
    //
    const styles = StyleSheet.create({
        actionButton: { backgroundColor: appColors.primaryColor, margin: 8, padding: 8, borderRadius: 5, opacity: disabled ? 0.5 : 1 },
        actionText: { padding: 8, paddingHorizontal: 16 },
        titleActionText: { fontSize: 13, fontWeight: '500', color: appColors.secondaryColor, textAlign: 'center' },
        titleActionButton: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.lightColor, textAlign: 'center' },
        iconContainer: {}
    })
    if (!visible) return <View />
    // Action Text
    if (isTitleButton) {
        return (
            <TouchableOpacity style={[styles.actionText, style]} onPress={onPress}>
                <Text style={[styles.titleActionText, textStyle]}>{title}</Text>
            </TouchableOpacity>
        )
    }
    // Default
    return (
        <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress} disabled={disabled}>
            {iconName && (
                <Icon type={appConfig.ICON_TYPE} name={iconName} size={24} color={iconColor || appColors.darkColor} />
            )}
            {!loading ?
                title && <Text style={[styles.titleActionButton, textStyle]}>{title}</Text>
                :
                <ActivityIndicator size='small' color={appColors.lightColor} />
            }
        </TouchableOpacity>
    );
};

export default Button;
