import React, { useEffect, useState } from "react"
import { View, Text, Modal, StyleSheet } from "react-native"
import { LinearProgress } from "@rneui/themed"
import codePush from "@revopush/react-native-code-push"
import LottieView from "lottie-react-native"
import useTheme from "../hooks/useTheme"
import Button from "./button/Button"
import { deviceWidth } from "../styles/styles"

const CodePush = ({ }) => {
    const { appColors } = useTheme()
    const [percent, setPercent] = useState(0)
    const [update, setUpdate] = useState(false)

    const LoadData = async () => {
        const updateSetting = {
            updateDialog: {
                title: "Cập nhật mới",
                appendReleaseDescription: true,
                mandatoryUpdateMessage: 'Vui lòng cập nhật bản cập nhật mới nhất để sử dụng ứng dụng\n',
                mandatoryContinueButtonLabel: "Cài đặt ngay",
                optionalIgnoreButtonLabel: "Bỏ qua",
                descriptionPrefix: "",
                optionalInstallButtonLabel: "Cập nhật",
            },
            installMode: codePush.InstallMode.IMMEDIATE
        }
        await codePush.sync(updateSetting, codePushStatusDidChange, codePushDownloadDidProgress)
    }
    const codePushStatusDidChange = (status) => {
        console.log("CodePush Status:", status)
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Đang kiểm tra bản cập nhật...");
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                setUpdate(true) // Hiển thị modal thông báo cập nhật
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Người dùng đã nhấn 'Cập nhật' -> Hiển thị popup tiến trình tải về");
                setUpdate(true) // Khi CodePush bắt đầu tải về, mở modal hiển thị tiến trình
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Đang cài đặt bản cập nhật...");
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("Ứng dụng đã là phiên bản mới nhất.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Cập nhật đã cài đặt xong.");
                setUpdate(false) // Đóng modal sau khi cài đặt xong
                break;
        }
    }
    const codePushDownloadDidProgress = ({ receivedBytes, totalBytes }) => {
        const _percent = receivedBytes / totalBytes;
        setPercent(_percent)
    }

    useEffect(() => {
        LoadData()
    }, [])

    const styles = StyleSheet.create({
        contentLoading: { flex: 1, backgroundColor: appColors.primaryColor, justifyContent: 'center', alignItems: 'center' },
        contentProcess: { padding: 12, alignItems: 'center' },
        contentLottie: { width: '100%', height: '60%' },
        layoutProcess: { width: deviceWidth * 0.9, height: 3, marginBottom: 10, borderRadius: 16, backgroundColor: appColors.backgroundColor },
        titlePercent: { fontSize: 13, fontWeight: '600', color: percent === 1 ? appColors.warningColor : appColors.backgroundColor, marginBottom: 3 },
        buttonAction: { backgroundColor: appColors.backgroundColor, borderRadius: 20, margin: 8, alignContent: 'center' },
        titleComplete: { color: appColors.textColor, textAlign: 'center', paddingHorizontal: 8, fontSize: 13, fontWeight: '600' },
    })
    if (!update) return <View />
    return (
        <Modal visible={update} transparent={false} animationType="fade">
            <View style={styles.contentLoading}>
                <View style={styles.contentLottie}>
                    <LottieView style={{ height: '90%' }} autoPlay source={require('../assets/lotties/updatesystem.json')} />
                </View>
                <View style={styles.contentProcess}>
                    <LinearProgress style={styles.layoutProcess} color={appColors.secondaryColor} value={percent} variant="indeterminate" />
                    <Text style={styles.titlePercent}>
                        {percent === 1 ? "(*) Nếu ứng dụng chưa cập nhật, vui lòng đóng và mở lại app" : "Đang tiến hành cập nhật hệ thống"}
                    </Text>
                </View>
                <Button
                    title='Hoàn thành'
                    disabled={percent !== 1}
                    style={styles.buttonAction}
                    textStyle={styles.titleComplete}
                    onPress={() => setUpdate(false)}
                />
            </View>
        </Modal>
    )
}

export default CodePush;