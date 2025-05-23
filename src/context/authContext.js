import React, { createContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AUTH_API } from '../services/authApi';
import { toastError } from '../utils/configToast';
import { KEYs } from '../utils/storageKeys';
import { Database } from '../database/Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Modal } from 'react-native';
import RNRestart from 'react-native-restart';
import { messageConfirm } from '../utils/helper';
import { fontWeightBold, TODAY } from '../utils/utility';
import ChangePasswordView from '../components/employee/changePassword/Page/ChangePasswordView';
import useTheme from '../hooks/useTheme';
import { Divider } from '@rneui/base';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const { appColors } = useTheme()

    // Handler action
    const login = async (data, actionResult) => {
        const result = await AUTH_API.login(data)
        if (result.statusId !== 200) {
            toastError('Lỗi đăng nhập', result.messager);
            await actionResult(false)
            return
        }
        //
        const userInfo = result.data[0]
        if (userInfo) {
            await AsyncStorage.setItem(KEYs.STORAGE.USER_INFO, JSON.stringify(userInfo));
            setIsLoggedIn(true)
            await Database.initializeDatabase(userInfo.employeeId)
            actionResult(true)
        };
    }
    const logout = async () => {
        try {
            await AsyncStorage.removeItem(KEYs.STORAGE.USER_INFO)
            setIsLoggedIn(false);
            RNRestart.Restart()
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    const forgotPassword = async (actionResult) => {

    }
    //
    const handlerLogOut = (message) => {
        const options = [{ text: 'Đồng ý', onPress: () => logout() }]
        messageConfirm('Tài khoản hết hạn', message, options)
    }
    //
    useEffect(() => {
        const logout_status = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.LOGOUT_STATUS, handlerLogOut)
        const checkAuthStatus = async () => {
            try {
                const result = JSON.parse(await AsyncStorage.getItem(KEYs.STORAGE.USER_INFO))
                if (result) {
                    // Token Expired
                    if (result?.expiredDate <= TODAY) {
                        logout()
                    } else {
                        setIsLoggedIn(true);
                        setUserInfo(result);
                    }
                } else {
                    setIsLoggedIn(false);
                    setUserInfo(null)
                }
            } catch (error) {
                console.error('AuthContext - Lỗi mã Token', error);
            }
        };
        checkAuthStatus();
        return () => { logout_status.remove() }
    }, [isLoggedIn])

    useEffect(() => {
        if (isLoggedIn && userInfo?.changePass <= TODAY.integer) {
            setShowChangePassword(true)
        }
    }, [isLoggedIn])
    //

    const styles = StyleSheet.create({
        contentChangePass: { flex: 1 },
        contentTitle: { padding: 12, backgroundColor: appColors.backgroundColor },
        titleChangePassword: { fontWeight: fontWeightBold, padding: 30, marginTop: 30, fontSize: 20, color: appColors.textColor },
        titleNotifyChange: { color: appColors.errorColor, fontSize: 12, fontWeight: fontWeightBold }

    })
    return (
        <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, forgotPassword }}>
            {children}
            <Modal visible={showChangePassword} animationType='slide'>
                <View style={styles.contentChangePass}>
                    <Text style={styles.titleChangePassword}>Đổi mật khẩu</Text>
                    <Divider />
                    <View style={styles.contentTitle}>
                        <Text style={styles.titleNotifyChange}>{'Mật khẩu của bạn đã hết hạn sử dụng. Bạn phải đổi mật khẩu mới để tiếp tục công việc'}</Text>
                    </View>
                    <ChangePasswordView onSuccess={() => setShowChangePassword(false)} />
                </View>
            </Modal>
        </AuthContext.Provider>
    );
}