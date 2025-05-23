import { Icon, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import CustomListView from "../lists/CustomListView";
import useTheme from "../../hooks/useTheme";
import { deviceHeight } from "../../styles/styles";
import { fontWeightBold } from "../../utils/utility";
import { MENU_CONTROLLER } from "../../controllers/MenuController";
import appConfig from "../../utils/appConfig/appConfig";
import { VALID_CONTROLLER } from "../../controllers/ValidController";
import { useDispatch, useSelector } from "react-redux";
import { setMenuReport } from "../../redux/actions";
import { toastError } from "../../utils/configToast";
import { KEYs } from "../../utils/storageKeys";

const ReportGuideline = ({ navigation }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [dataReport, setDataReport] = useState(false)
    const dispatch = useDispatch()
    //
    const LoadData = async () => {
        await MENU_CONTROLLER.GetDataReportChecked(shopInfo, setDataReport)
    }
    // Handler
    const handlerReportPress = async (item) => {
        await VALID_CONTROLLER.attendanceWork(shopInfo, async (isAttendance) => {
            if (isAttendance) {
                await dispatch(setMenuReport(item))
                await navigation.replace(item.pageName)
                SheetManager.hide(KEYs.ACTION_SHEET.CHECKED_SHEET)
            } else {
                toastError('Chưa chấm công', 'Vui lòng chấm công trước khi làm báo cáo')
            }
        })
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    // View
    const styles = StyleSheet.create({
        contentSheet: { width: '100%', height: deviceHeight / 3, backgroundColor: appColors.backgroundColor },
        titleHeadWork: { textAlign: 'center', padding: 8, fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor },
        itemMain: { margin: 8, marginBottom: 0, borderRadius: 5, borderWidth: 1, borderColor: appColors.borderColor, padding: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: appColors.cardColor },
        contentTitle: { width: '94%' },
        titleName: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor },
        statusName: { fontSize: 12, color: appColors.subTextColor, fontStyle: 'italic' }
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            handlerReportPress(item)
        }
        const iconName = item.isUploaded == 1 ? "checkmark-circle" : item.isLocked == 1 ? "ellipse" : "ellipse-outline"
        const iconColor = item.isUploaded == 1 ? appColors.successColor : item.isLocked == 1 ? appColors.warningColor : appColors.errorColor
        const statusName = item.isUploaded == 1 ? `Đã hoàn thành` : item.isLocked == 1 ? `Đã hoàn thành - Chưa gửi báo cáo` : `Chưa hoàn thành`
        return (
            <TouchableOpacity key={index} style={styles.itemMain} onPress={onPress}>
                <View style={styles.contentTitle}>
                    <Text style={styles.titleName}>{item.menuNameVN}</Text>
                    <Text style={styles.statusName}>{statusName}</Text>
                </View>
                <Icon type={appConfig.ICON_TYPE} name={iconName} size={24} color={iconColor} />
            </TouchableOpacity>
        )
    }
    return (
        <ActionSheet id={KEYs.ACTION_SHEET.CHECKED_SHEET}>
            <SafeAreaView style={styles.contentSheet}>
                <Text style={styles.titleHeadWork}>Danh sách công việc</Text>
                <CustomListView
                    data={dataReport}
                    renderItem={renderItem}
                />
            </SafeAreaView>
        </ActionSheet>
    )
}

export default ReportGuideline;