import React, { forwardRef, useEffect, useMemo, useState } from "react";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from "@rneui/themed";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { fontWeightBold } from "../../utils/utility";
import { VALID_CONTROLLER } from "../../controllers/ValidController";
import { KEYs } from "../../utils/storageKeys";
import ShopOverview from "../infomation/shop/ShopOverview";
import useTheme from "../../hooks/useTheme";
import Button from "../button/Button";
import { isValidNumber } from "../../utils/validateData";

const PlanInfoSheet = forwardRef((props, ref) => {
    const { navigation, onStartWork, shopInfo } = props
    const { appColors } = useTheme()
    const [isOverview, setIsOverview] = useState(false)
    const snapPoints = useMemo(() => ['55%', '100%'], []);
    //
    const handlerCheckOverview = async () => {
        if (isValidNumber(shopInfo.auditDate))
            await VALID_CONTROLLER.photoOverview(shopInfo, setIsOverview)
    }

    useEffect(() => {
        const reload_photo_overview = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_PHOTO_OVERVIEW, handlerCheckOverview)
        handlerCheckOverview()
        return () => {
            reload_photo_overview.remove()
        }
    }, [props])

    const styles = StyleSheet.create({
        bottomStyle: { zIndex: 140 },
        contentContainer: { flex: 1, padding: 12, backgroundColor: appColors.cardColor },
        titleBottomSheet: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor },
        titleContentBottomSheet: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor },
        contentOverview: { height: '30%', marginTop: 3, borderRadius: 8, overflow: 'hidden', backgroundColor: appColors.backgroundColor, shadowColor: appColors.shadowColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, elevation: 3, borderWidth: 1, borderColor: appColors.borderColor },
    })
    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            style={styles.bottomStyle}>
            <BottomSheetView style={styles.contentContainer} >
                <Text style={styles.titleBottomSheet}>{`Cửa hàng: ${shopInfo.shopName}`}</Text>
                <Text style={styles.titleContentBottomSheet}>{`Code: ${shopInfo.shopCode}`}</Text>
                <Text style={styles.titleContentBottomSheet}>{`Đc: ${shopInfo.address}`}</Text>
                <View style={styles.contentOverview}>
                    <ShopOverview navigation={navigation} />
                </View>
                <Button
                    title="Bắt đầu thực hiện"
                    visible={isOverview}
                    onPress={onStartWork} />
            </BottomSheetView>
        </BottomSheet>

    )
}, [])

export default PlanInfoSheet;