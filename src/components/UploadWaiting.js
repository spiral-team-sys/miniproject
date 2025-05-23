import React, { useEffect } from "react";
import useTheme from "../hooks/useTheme";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { fontWeightBold } from "../utils/utility";
import { deviceHeight } from "../styles/styles";

const UploadWaiting = ({ title, isWaiting = false, containerStyle }) => {
    const { appColors } = useTheme()

    useEffect(() => {
        return () => false
    }, [isWaiting])

    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: deviceHeight, backgroundColor: appColors.backgroundColor, opacity: 1, position: 'absolute', justifyContent: 'center', zIndex: 1 },
        titleMain: { width: '100%', textAlign: 'center', fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8 }
    })

    return (
        isWaiting ?
            <View style={[styles.mainContainer, containerStyle]}>
                <ActivityIndicator size='small' color={appColors.primaryColor} />
                <Text style={styles.titleMain}>{title || 'Đang gửi dữ liệu lên hệ thống'}</Text>
            </View>
            :
            null
    )
}
export default UploadWaiting;