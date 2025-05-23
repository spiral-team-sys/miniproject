import React, { useState } from "react";
import { View, StyleSheet } from 'react-native'
import FieldInput from "../../../fields/FieldInput";
import useTheme from "../../../../hooks/useTheme";
import { EMPLOYEE_API } from "../../../../services/employeeApi";
import { messageAlert, messageConfirm } from "../../../../utils/helper";
import Header from "../../../Header";
import Button from "../../../button/Button";
import { isValidChangePassword, isValidField } from "../../../../utils/validateData";
import useAuth from "../../../../hooks/useAuth";

const ChangePasswordView = ({ onClose }) => {
    const [itemChange, setItemChange] = useState({ oldPass: null, newPass: null, confirmPass: null });
    const [isShowPassword, setShowPassword] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const { appColors } = useTheme();
    const { logout } = useAuth()
    //
    const handlerChangePassword = () => {
        const isValid = validData()
        if (!isValid)
            return
        //
        const options = [{ text: 'Hủy' }, {
            text: 'Đồng ý', onPress: async () => {
                await setLoading(true);
                await EMPLOYEE_API.ChangePassword(itemChange.oldPass, itemChange.newPass, async (result) => {
                    if (result > 0)
                        logout()
                    else
                        messageAlert("Thông báo", result.messeger);
                });
                await setLoading(false);
            }
        }]
        messageConfirm('Thông báo', 'Xác nhận đổi mật khẩu, Sau khi đổi mật khẩu ứng dụng sẽ đăng xuất vui lòng nhập lại mật khẩu', options)
    }
    const validData = () => {
        if (!isValidField(itemChange.oldPass)) {
            messageAlert('Mật khẩu cũ', 'Bạn chưa nhập mật khẩu cũ');
            return false
        }
        if (!isValidField(itemChange.newPass)) {
            messageAlert('Mật khẩu mới', 'Bạn chưa nhập mật khẩu mới');
            return false
        } else {
            if (!isValidChangePassword(itemChange.newPass)) {
                messageAlert('Mật khẩu mới', 'Mật khẩu phải bao gồm chữ in hoa, chữ thường số và kí tự đặc biệt (tối thiểu 8 kí tự)');
                return false
            }
        }
        if (!isValidField(itemChange.confirmPass)) {
            messageAlert('Xác nhận mật khẩu', 'Bạn chưa nhập xác nhận mật khẩu mới');
            return false
        }
        if (itemChange.oldPass == itemChange.newPass) {
            messageAlert('Mật khẩu', 'Mật khẩu mới không được giống mật khẩu cũ');
            return false
        }
        if (itemChange.confirmPass !== itemChange.newPass) {
            messageAlert('Mật khẩu', 'Xác nhận mật khẩu chưa chính xác');
            return false
        }
        return true
    }
    const handlerShowPassword = () => {
        setShowPassword(e => !e)
    }
    const onChangePassword = (key, value) => {
        setItemChange({ ...itemChange, [key]: value });
    }

    const styles = StyleSheet.create({
        mainContainer: { width: '100%' },
        contentContainer: { padding: 8, zIndex: 1 },
        buttonConfirm: { alignItems: 'center', backgroundColor: appColors.primaryColor, padding: 12, borderRadius: 6, marginHorizontal: 12 },
        contentButton: { flexDirection: 'row', padding: 8, justifyContent: 'center' },
        buttonCancel: { width: '40%', backgroundColor: appColors.backgroundColor, borderWidth: 1, borderColor: appColors.primaryColor },
        titleButtonCancel: { color: appColors.primaryColor },
        buttonConfirm: { width: '40%' },
    });
    return (
        <View style={styles.mainContainer}>
            <Header
                title='Đổi mật khẩu'
                textColor={appColors.textColor}
            />
            <View style={styles.contentContainer}>
                <FieldInput
                    label='Mật khẩu hiện tại *'
                    secureTextEntry={isShowPassword}
                    rightIconColor={appColors.grayColor}
                    rightIconName={isShowPassword ? 'eye-off' : 'eye'}
                    onChangeText={(e) => onChangePassword('oldPass', e)}
                    onRightPress={handlerShowPassword}
                />
                <FieldInput
                    label='Mật khẩu mới *'
                    secureTextEntry={isShowPassword}
                    rightIconColor={appColors.grayColor}
                    rightIconName={isShowPassword ? 'eye-off' : 'eye'}
                    onChangeText={(e) => onChangePassword('newPass', e)}
                    onRightPress={handlerShowPassword}
                />
                <FieldInput
                    label='Xác nhận mật khẩu mới *'
                    secureTextEntry={isShowPassword}
                    rightIconColor={appColors.grayColor}
                    rightIconName={isShowPassword ? 'eye-off' : 'eye'}
                    onChangeText={(e) => onChangePassword('confirmPass', e)}
                    onRightPress={handlerShowPassword}
                />
            </View>
            <View style={styles.contentButton}>
                <Button
                    title='Hủy'
                    style={styles.buttonCancel}
                    textStyle={styles.titleButtonCancel}
                    onPress={onClose}
                />
                <Button
                    title='Xác nhận'
                    loading={isLoading}
                    style={styles.buttonConfirm}
                    onPress={handlerChangePassword}
                />
            </View>
        </View>
    )
}

export default ChangePasswordView