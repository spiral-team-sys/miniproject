import React, { forwardRef, useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from "@rneui/themed";
import useTheme from "../../hooks/useTheme";
import { fontWeightBold } from "../../utils/utility";

const NotificationDetailsSheet = forwardRef((props, ref) => {
    const { item } = props
    const { appColors } = useTheme()
    const snapPoints = useMemo(() => ['100%'], []);
    //
    useEffect(() => {

    }, [props])

    const styles = StyleSheet.create({
        bottomStyle: { zIndex: 140 },
        contentContainer: { flex: 1, padding: 12, backgroundColor: appColors.backgroundColor },
        titleStyle: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8 },
        bodyStyle: { fontSize: 13, fontWeight: '500', color: appColors.textColor, padding: 16, paddingTop: 0 },
    })
    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            style={styles.bottomStyle}>
            <BottomSheetView style={styles.contentContainer}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <Text style={styles.bodyStyle}>{item.body}</Text>
            </BottomSheetView>
        </BottomSheet>

    )
}, [])

export default NotificationDetailsSheet;