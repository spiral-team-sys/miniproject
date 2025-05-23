import React, { forwardRef, useEffect, useMemo, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Text } from "@rneui/themed";
import { DeviceEventEmitter, Platform, StyleSheet, View } from "react-native";
import { fontWeightBold } from "../../utils/utility";
import { NumericFormat } from "react-number-format";
import { VALID_CONTROLLER } from "../../controllers/ValidController";
import { KEYs } from "../../utils/storageKeys";
import ShopOverview from "../infomation/shop/ShopOverview";
import useTheme from "../../hooks/useTheme";
import Button from "../button/Button";
import { useSelector } from "react-redux";
import { toastInfo } from "../../utils/configToast";
import appConfig, { eoeApp } from "../../utils/appConfig/appConfig";
import { LOCATION_INFO } from "../../utils/locationInfo/LocationInfo";

const ShopInfoSheet = forwardRef((props, ref) => {
    const { navigation, onStartWork, snapPointValue, shopInfo } = props
    const { appColors } = useTheme()
    const { statusInfo } = useSelector(state => state.status)
    const [isOverview, setIsOverview] = useState(false)
    const [isSignBoard, setIsSignBoard] = useState(false)
    const snapPoints = useMemo(() => {
        if (appConfig.APPID == eoeApp) {
            return ['100%']
        }
        return snapPointValue || ['60%', '100%']
    }, [snapPointValue]);
    //
    const handlerCheckOverview = async () => {
        await VALID_CONTROLLER.photoSignBoard(shopInfo, setIsSignBoard)
        await VALID_CONTROLLER.photoOverview(shopInfo, setIsOverview)
    }

    const handlerCheckWorking = () => {
        if (appConfig.APPID == eoeApp && (statusInfo?.statusId || 0) == 0) {
            toastInfo('Bắt đầu làm việc', `Vui lòng bấm bắt đầu làm việc trước khi khảo sát cửa hàng`)
        } else {
            onStartWork()
        }
    }

    const handlerDIrection = () => {
        LOCATION_INFO.openGoogleMapsDirections(shopInfo.latitude, shopInfo.longitude)
    }

    useEffect(() => {
        const reload_overview = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_DOING_OVERVIEW, handlerCheckOverview)
        handlerCheckOverview()
        return () => {
            reload_overview.remove()
        }
    }, [props])

    const styles = StyleSheet.create({
        bottomStyle: { flex: 1, zIndex: 140 },
        contentContainer: { height: '100%', backgroundColor: appColors.backgroundColor, margin: 12, paddingBottom: Platform.OS === 'android' ? 100 : 50 },
        contentInfo: { flex: 1 },
        titleStatusAudit: { fontSize: 13, fontWeight: fontWeightBold, color: shopInfo.isLockReport == 0 ? appColors.successColor : appColors.errorColor, fontStyle: 'italic' },
        titleBottomSheet: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor },
        titleContentBottomSheet: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor },
        contentOverview: { marginTop: 3, borderRadius: 8, overflow: 'hidden' },
        bottomActionStart: { width: '100%' },
        bottomView: { height: 100 },
        contentDitection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        buttonDirection: { backgroundColor: appColors.transparent, alignItems: 'flex-start', paddingHorizontal: 0, padding: 0 },
        textDirection: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.secondaryColor, textAlign: 'center', textDecorationLine: 'underline', paddingHorizontal: 8 },
    })
    return (
        <BottomSheet
            ref={ref}
            index={-1}
            backgroundStyle={{ backgroundColor: appColors.backgroundColor }}
            snapPoints={snapPoints}
            enablePanDownToClose
            style={styles.bottomStyle}>
            <BottomSheetScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
                <View style={styles.contentInfo}>
                    {shopInfo.messageLockReport && <Text style={styles.titleStatusAudit}>{`Trạng thái chấm điểm: ${shopInfo.messageLockReport || ''}`}</Text>}
                    <Text style={styles.titleBottomSheet}>{`Cửa hàng: ${shopInfo.shopCode} - ${shopInfo.shopName}`}</Text>
                    <View style={styles.contentDitection}>
                        <Text style={{ ...styles.titleContentBottomSheet, width: '80%' }}>{`Địa chỉ: ${shopInfo.address}`}</Text>
                        <Button
                            isTitleButton
                            title='Chỉ đường'
                            style={styles.buttonDirection}
                            textStyle={styles.textDirection}
                            onPress={handlerDIrection}
                        />
                    </View>
                    <Text style={styles.titleContentBottomSheet}>{`Loại hình: ${shopInfo.subSegment || ''}`}</Text>
                    <Text style={styles.titleContentBottomSheet}>{`Người liên hệ: ${shopInfo.contactName || ''} - ${shopInfo.phone || ''}`}</Text>
                    <NumericFormat
                        thousandSeparator
                        value={shopInfo.distance}
                        displayType='text'
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={e => <Text style={styles.titleContentBottomSheet}>{e ? `Khoảng cách: ${e} m` : `Khoảng cách: Chưa xác định`}</Text>}
                    />

                    {shopInfo.isLockReport == 0 &&
                        <View style={styles.contentOverview}>
                            <ShopOverview
                                navigation={navigation}
                                isOverview={isOverview}
                            />
                        </View>
                    }
                </View>
                <View style={styles.bottomActionStart}>
                    <Button
                        title="Bắt đầu thực hiện"
                        visible={shopInfo.isLockReport == 0 && (appConfig.APPID == eoeApp ? isSignBoard : isOverview)}
                        onPress={handlerCheckWorking}
                    />
                </View>
                <View style={styles.bottomView} />
            </BottomSheetScrollView>
        </BottomSheet>
    )
}, [])

export default ShopInfoSheet;