import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { CheckBox } from '@rneui/themed';
import appConfig from '../../utils/appConfig/appConfig';

const FieldCheckBox = ({ title, checked, disabled = false, checkedIcon = 'checkbox', uncheckedIcon = 'square-outline', checkedColor, onPress, style, containerStyle, textStyle }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        container: { flex: 1 },
        checkboxContainer: { backgroundColor: 'transparent', borderWidth: 0, padding: 0 },
        checkboxText: { fontSize: 13, fontWeight: '500', color: appColors.textColor },
    });

    return (
        <View style={[styles.container, style]}>
            <CheckBox
                title={title}
                checked={checked}
                disabled={disabled}
                iconType={appConfig.ICON_TYPE}
                checkedColor={checkedColor || appColors.secondaryColor}
                checkedIcon={checkedIcon}
                uncheckedIcon={uncheckedIcon}
                onPress={onPress}
                containerStyle={[styles.checkboxContainer, containerStyle]}
                textStyle={[styles.checkboxText, textStyle]}
            />
        </View>
    );
};

export default FieldCheckBox;
