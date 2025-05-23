import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/button/Button';
import FieldInput from '../../components/fields/FieldInput';
import FieldCheckBox from '../../components/fields/FieldCheckBox';
import { Image, Text } from '@rneui/themed';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { fontWeightBold } from '../../utils/utility';
import { initializeDeviceInfo } from '../../utils/globals';
import { validateLoginData } from '../../utils/validateData';
import { deviceHeight } from '../../styles/styles';
import { FIREBASE } from '../../utils/firebaseMessaging';
import appConfig from '../../utils/appConfig/appConfig';
import moment from 'moment';

const LoginScreen = ({ navigation }) => {
    const { appColors } = useTheme()
    const { login } = useAuth()
    const [isLoading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isConfirmPolicy, setConfirmPolicy] = useState(false)
    const [deviceInfo, setDeviceInfo] = useState({})
    const [validateData, setValidateData] = useState({})
    const userRef = useRef(null)
    const passRef = useRef(null)
    // 
    const LoadData = async () => {
        await initializeDeviceInfo(setDeviceInfo)
    }
    // Handler
    const handlerLogin = async () => {
        const { isValid, errors } = validateLoginData(username, password, isConfirmPolicy);
        if (isValid) {
            await setLoading(true)
            //
            const deviceInfo = await initializeDeviceInfo()
            const fcmToken = await FIREBASE.getFCMToken()
            const data = {
                loginName: username, // EOE Only
                username: username,
                password: password,
                DeviceToken: fcmToken,
                Versionid: deviceInfo.getBuildNumber,
                DeviceType: Platform.OS === 'ios' ? 1 : 2,
                IMEI: deviceInfo.deviceId,
                ClientTime: moment().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            await login(data, async (isSuccess) => {
                isSuccess && navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] })
            })
            await setLoading(false)
        } else {
            setValidateData(errors)
        }
    }
    const handlerForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    const handlerPressPolicy = () => {
        setConfirmPolicy(e => !e)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [])
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        if (Object.keys(validateData).length > 0)
            setValidateData({})
        else return
        return () => {
            isMounted = false
        }
    }, [username, password])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentHead: { padding: 32 },
        contentMain: { backgroundColor: appColors.backgroundColor, margin: 16, padding: 8, borderRadius: 16, marginBottom: 0 },
        contentSupport: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 16 },
        contentInfomation: { width: '100%', padding: 8, position: 'absolute', bottom: 12, alignItems: 'center', zIndex: 0 },
        headText: { fontSize: 24, color: appColors.textColor, fontWeight: 'bold', textAlign: 'center', padding: 16 },
        policyView: { width: '50%', justifyContent: 'flex-start' },
        forgotPasswordView: { width: '50%', alignItems: 'flex-end' },
        titlePolicy: { fontSize: 12, color: appColors.subTextColor },
        titleInfo: { fontSize: 11, color: appColors.lightColor, fontWeight: fontWeightBold, textAlign: 'center' },
        imageCompanyStyle: { width: '100%', height: 70, },
        bottomItemView: { height: Platform.OS == 'android' ? 8 : deviceHeight / 3 },
        lottie: { width: 50, height: 50 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            {/* // */}
            <View style={styles.contentHead}>
                <Image
                    source={require('../../assets/images/logo_spiral_white.png')}
                    resizeMethod='scale'
                    resizeMode='contain'
                    style={styles.imageCompanyStyle}
                />
            </View>
            {/* // Content Main */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ zIndex: 1 }} bounces={false} >
                <View style={styles.contentMain}>
                    <Text style={[styles.headText, { paddingBottom: 7 }]}>Đăng nhập</Text>
                    <Text style={[styles.titleInfo, { fontSize: 16, color: appColors.primaryColor }]}>{appConfig.APPNAME}</Text>
                    <FieldInput
                        ref={userRef}
                        label="Tên đăng nhập"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        error={validateData.username}
                        inputContainerStyle={{ marginBottom: 16 }}
                        returnKeyType='next'
                        onChangeText={setUsername}
                        onSubmitEditing={() => passRef.current.focus()}
                    />
                    <FieldInput
                        ref={passRef}
                        secureTextEntry={!showPassword}
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        rightIconColor={appColors.grayColor}
                        value={password}
                        error={validateData.password}
                        onSubmitEditing={handlerLogin}
                        onChangeText={setPassword}
                        onRightPress={() => setShowPassword(e => !e)}
                    />
                    <View style={styles.contentSupport}>
                        <FieldCheckBox
                            title='Đồng ý các điều khoản'
                            checked={isConfirmPolicy}
                            style={styles.policyView}
                            textStyle={styles.titlePolicy}
                            onPress={handlerPressPolicy}
                        />
                        <Button
                            isTitleButton
                            title='Quên mật khẩu ?'
                            style={styles.forgotPasswordView}
                            textStyle={{ fontSize: 12 }}
                            onPress={handlerForgotPassword} />
                    </View>
                    <Button
                        title='Đăng nhập'
                        disabled={!isConfirmPolicy}
                        loading={isLoading}
                        style={{ padding: 12 }}
                        onPress={handlerLogin}
                    />
                </View>
                <View style={styles.bottomItemView} />
            </ScrollView>
            {/* // Bottom Info */}
            <View style={styles.contentInfomation}>
                <Text style={{ ...styles.titleInfo, marginBottom: 8 }}>{`Phiên bản: ${deviceInfo?.getVersion || 0}`}</Text>
                <Text style={styles.titleInfo}>Công ty TNHH Sức bật</Text>
                <Text style={styles.titleInfo}>27B, Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP.HCM</Text>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
