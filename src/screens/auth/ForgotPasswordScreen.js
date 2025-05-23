import React, { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../components/GradientBackground";
import { Image, Text } from "@rneui/themed";
import { deviceHeight } from "../../styles/styles";
import { fontWeightBold } from "../../utils/utility";
import Button from "../../components/button/Button";
import FieldInput from "../../components/fields/FieldInput";
import { initializeDeviceInfo } from "../../utils/globals";
import { validateForgotPasswordData } from "../../utils/validateData";
import useAuth from "../../hooks/useAuth";
import RNRestart from 'react-native-restart';

const ForgotPasswordScreen = ({ navigation }) => {
    const { appColors } = useTheme()
    const { forgotPassword } = useAuth()
    const [isLoading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [deviceInfo, setDeviceInfo] = useState({})
    const [validateData, setValidateData] = useState({})
    const userRef = useRef()
    const emailRef = useRef()
    //
    const LoadData = async () => {
        await initializeDeviceInfo(setDeviceInfo)
    }
    // Handler
    const handlerForgotPassword = async () => {
        const { isValid, errors } = validateForgotPasswordData(username, email);
        if (isValid) {
            await setLoading(true)
            await forgotPassword({ username, email }, () => RNRestart.Restart())
            await setLoading(false)
        } else {
            setValidateData(errors)
        }
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentHead: { padding: 32 },
        contentMain: { backgroundColor: appColors.lightColor, margin: 16, padding: 8, borderRadius: 16, marginBottom: 0 },
        contentInfomation: { width: '100%', padding: 8, position: 'absolute', bottom: 12, alignItems: 'center', zIndex: 0 },
        headText: { fontSize: 24, color: appColors.textColor, fontWeight: 'bold', textAlign: 'center', padding: 16 },
        titleInfo: { fontSize: 11, color: appColors.lightColor, fontWeight: fontWeightBold, textAlign: 'center' },
        imageCompanyStyle: { width: '100%', height: 70 },
        bottomItemView: { height: Platform.OS == 'android' ? 8 : deviceHeight / 3 }
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
                    <Text style={styles.headText}>Quên mật khẩu</Text>
                    <FieldInput
                        ref={userRef}
                        label="Tên đăng nhập"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        error={validateData.username}
                        inputContainerStyle={{ marginBottom: 16 }}
                        returnKeyType='next'
                        onChangeText={setUsername}
                        onSubmitEditing={() => emailRef.current.focus()}
                    />
                    <FieldInput
                        ref={emailRef}
                        label="Email"
                        placeholder="Nhập email nhận yêu cầu"
                        value={email}
                        error={validateData.email}
                        inputContainerStyle={{ marginBottom: 16 }}
                        returnKeyType='next'
                        onChangeText={setEmail}
                        onSubmitEditing={handlerForgotPassword}
                    />
                    <Button
                        title='Gửi yêu cầu'
                        loading={isLoading}
                        style={{ padding: 12 }}
                        onPress={handlerForgotPassword}
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
    )
}

export default ForgotPasswordScreen;