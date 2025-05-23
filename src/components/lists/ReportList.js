import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from "react-native";
import { MENU_CONTROLLER } from "../../controllers/MenuController";
import { Icon, Text } from "@rneui/themed";
import CustomListView from "./CustomListView";
import { fontWeightBold } from "../../utils/utility";
import { useDispatch, useSelector } from "react-redux";
import { setMenuReport } from "../../redux/actions";
import { VALID_CONTROLLER } from "../../controllers/ValidController";
import { toastError } from "../../utils/configToast";
import { KEYs } from "../../utils/storageKeys";
import Loading from "../Loading";

const ReportList = ({ navigation }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [isLoading, setLoading] = useState(false)
    const [menuList, setMenuList] = useState([])
    const dispatch = useDispatch()
    //
    const LoadDataMenu = async () => {
        await MENU_CONTROLLER.GetDataMenuReport(shopInfo, setMenuList)
    }
    // Handler
    const handlerMenuItem = async (item) => {
        await setLoading(true)
        await VALID_CONTROLLER.attendanceWork(shopInfo, async (isAttendance) => {
            // 1 = menu Attendance
            if (item.id == 1 || isAttendance) {
                await dispatch(setMenuReport(item))
                await navigation.navigate(item.pageName)
            } else {
                toastError('Chưa chấm công', 'Vui lòng chấm công trước khi làm báo cáo')
            }
        })
        await setLoading(false)
    }
    //
    useEffect(() => {
        const reload_menu = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_MENU_REPORT, LoadDataMenu)
        let isMounted = true
        if (!isMounted)
            return
        LoadDataMenu()
        return () => {
            isMounted = false
            reload_menu.remove()
        }
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, padding: 4 },
        itemMain: { flex: 1, height: 90, padding: 8, margin: 4, alignItems: 'center', borderRadius: 16, borderWidth: 0.5, borderColor: appColors.borderColor, backgroundColor: appColors.cardColor, shadowColor: appColors.shadowColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, elevation: 3 },
        titleView: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.textColor, textAlign: 'center' },
        subTitleView: { fontSize: 11, fontWeight: '500', color: appColors.subTextColor, textAlign: 'center' },
        iconStyle: { paddingBottom: 8 }
    })
    const renderItem = ({ item, index }) => {
        const onPressItem = () => {
            handlerMenuItem(item)
        }
        return (
            <TouchableOpacity key={`menu-list-${index}`} style={styles.itemMain} onPress={onPressItem}>
                <Icon type={item.iconType} name={item.iconName} size={32} color={appColors.primaryColor} style={styles.iconStyle} />
                <Text style={styles.titleView} numberOfLines={1} ellipsizeMode="tail">{item.menuNameVN}</Text>
                <Text style={styles.subTitleView} numberOfLines={1} ellipsizeMode="tail">{item.menuName}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <Loading isLoading={isLoading} color={appColors.textColor} />
            <CustomListView
                data={menuList}
                extraData={menuList}
                numColumns={3}
                renderItem={renderItem}
            />
        </View>
    )
}
export default ReportList;