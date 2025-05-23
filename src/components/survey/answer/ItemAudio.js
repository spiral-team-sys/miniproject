import React, { useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import useTheme from "../../../hooks/useTheme";
import Button from "../../button/Button";
import { Text } from "@rneui/base";
import { useSelector } from "react-redux";
import { KEYs } from "../../../utils/storageKeys";

const ItemAudio = ({ itemMain, disabled = false }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const { audioInfo } = useSelector(state => state.audio)
    //
    const onRecord = () => {
        if (audioInfo?.isRecorder) {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_STOP)
        } else {
            const item = {
                isRecorder: true,
                reportId: -1,
                shopId: shopInfo.shopId,
                auditDate: shopInfo.auditDate
            }
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_START, item)
        }
    }
    //
    useEffect(() => {
        return () => false
    }, [itemMain])
    // 
    const styles = StyleSheet.create({
        itemMainContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        titleName: { width: '60%', fontSize: 13, fontWeight: '500', color: appColors.textColor },
        buttonAudio: { backgroundColor: appColors.cardColor, borderWidth: 1, borderColor: appColors.borderColor }
    })
    return (
        <View style={styles.itemMainContainer}>
            <Text style={styles.titleName}>{`${itemMain.ItemName}`}</Text>
            <Button
                disabled={disabled}
                iconName={audioInfo?.isRecorder ? 'stop' : 'mic'}
                iconColor={audioInfo?.isRecorder ? appColors.errorColor : appColors.primaryColor}
                style={styles.buttonAudio}
                onPress={onRecord}
            />
        </View>
    )
}
export default ItemAudio;