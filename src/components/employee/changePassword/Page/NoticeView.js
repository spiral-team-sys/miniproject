import React from "react";
import { View, Text, StyleSheet, } from 'react-native'
import { fontWeightBold } from "../../../../utils/utility";
import useTheme from "../../../../hooks/useTheme";
import Button from "../../../button/Button";

const NoticeView = ({ onChangePass }) => {
    const { appColors } = useTheme();
    const styles = StyleSheet.create({
        titleHeader: { fontSize: 15, fontWeight: fontWeightBold, color: appColors.primaryColor, padding: 8, textAlign: 'center' },
        titleContent: { fontSize: 14, fontWeight: '500', color: appColors.subTextColor, padding: 16, paddingTop: 8 }
    });
    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>{'Lưu ý khi thay đổi mật khẩu'}</Text>
            <Text style={styles.titleContent}>{'Mật khẩu phải bao gồm chữ In hoa, chữ thường số và kí tự đặc biệt, tối thiểu 8 kí tự'}</Text>
            <Button
                title='Đổi mật khẩu'
                onPress={onChangePass}
            />
        </View>
    )
};
export default NoticeView
