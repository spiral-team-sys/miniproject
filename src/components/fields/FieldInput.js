import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Input, Text } from "@rneui/themed";
import appConfig from "../../utils/appConfig/appConfig";
import { fontWeightBold } from "../../utils/utility";
import useTheme from "../../hooks/useTheme";

const FieldInput = forwardRef((props, ref) => {
    const {
        label, placeholder, error, value, defaultValue, disabled = false, visible = true, multiline = false, allowFontScaling = true, maxLength = 10000,
        style, inputStyle, inputContainerStyle, placeholderColor, labelStyle,
        returnKeyType, secureTextEntry = false, keyboardType = "default",
        leftIconName, leftIconColor, rightIconName, rightIconColor,
        onLeftPress, onRightPress, onChangeText, onSubmitEditing, onFocus, onEndEditing
    } = props
    //
    const { appColors } = useTheme()
    const styles = StyleSheet.create({
        inputMain: { width: '100%' },
        inputContainer: { width: '100%', paddingEnd: rightIconName ? 8 : 0, paddingStart: leftIconName ? 8 : 0, borderColor: appColors.borderColor, borderWidth: 1, borderRadius: 8, backgroundColor: disabled ? appColors.cardColor : appColors.backgroundColor },
        input: { width: '100%', padding: 8, fontSize: 12, color: appColors.textColor },
        labelInput: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, paddingBottom: 8, paddingHorizontal: 12 },
        warningText: { fontSize: 11, fontWeight: '500', color: appColors.errorColor, paddingHorizontal: 12, paddingBottom: 8, fontStyle: 'italic' }
    })
    // if (!visible) return <View />
    return (
        <View style={styles.inputMain}>
            {label && <Text style={[styles.labelInput, labelStyle]}>{label}</Text>}
            {error && <Text style={styles.warningText}>* {error}</Text>}
            <Input
                ref={ref}
                disabled={disabled}
                placeholder={placeholder}
                multiline={multiline}
                value={value}
                defaultValue={defaultValue}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                maxLength={maxLength}
                errorStyle={{ marginBottom: 8 }}
                renderErrorMessage={false}
                style={style}
                inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
                inputStyle={[styles.input, inputStyle]}
                placeholderTextColor={placeholderColor || appColors.placeholderColor}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
                onEndEditing={onEndEditing}
                onChangeText={onChangeText}
                returnKeyType={returnKeyType || 'default'}
                allowFontScaling={allowFontScaling}
                leftIcon={
                    <Icon
                        type={appConfig.ICON_TYPE}
                        name={leftIconName}
                        color={leftIconColor || appColors.darkColor}
                        size={18}
                        onPress={onLeftPress || null}
                    />
                }
                rightIcon={
                    <Icon
                        type={appConfig.ICON_TYPE}
                        name={rightIconName}
                        color={rightIconColor || appColors.darkColor}
                        size={24}
                        onPress={onRightPress || null}
                    />
                }
            />
        </View>
    )
})

export default FieldInput;