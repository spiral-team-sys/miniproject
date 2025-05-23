import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { DeviceEventEmitter, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MENU_CONTROLLER } from "../../controllers/MenuController";
import { Icon, Text } from "@rneui/themed";
import appConfig from "../../utils/appConfig/appConfig";
import { isValidData } from "../../utils/validateData";
import { KEYs } from "../../utils/storageKeys";

const MenuList = ({ navigation, headerView = <View />, onRefresh, isRefreshData = false, orientation = 'LANDSCAPE' }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataMenu, setDataMenu] = useState([])

    const LoadData = async () => {
        await MENU_CONTROLLER.GetDataMenuHome(setDataMenu)
    }
    const handlerMenuPress = (item) => {
        if (item.pageName === 'popup') {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.POPUP_WEBVIEW, item);
        } else {
            navigation.navigate(item.pageName)
        }
    }

    useEffect(() => {
        LoadData()
    }, [appColors, isRefreshData])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        itemMain: { backgroundColor: appColors.backgroundColor, borderBottomColor: appColors.borderColor, borderBottomWidth: 1 },
        buttonMenu: { flexDirection: 'row', flex: 1, padding: 8, marginEnd: 8, alignItems: 'center' },
        contentTitle: { flexGrow: 1, padding: 5, justifyContent: 'center' }
    })

    const renderItem = ({ item, index }) => {
        const onPress = () => handlerMenuPress(item)
        return (
            <View key={index} style={styles.itemMain}>
                <TouchableOpacity onPress={onPress} style={styles.buttonMenu}>
                    <Icon reverse color={appColors.primaryColor} type={item.iconType || appConfig.ICON_TYPE} name={item.iconName} />
                    <View style={styles.contentTitle}>
                        <Text style={styleDefault.titleName}>{item.menuNameVN}</Text>
                        <Text style={styleDefault.subTitleName}>{item.menuName}</Text>
                    </View>
                    <Icon color={appColors.primaryColor} size={16} type={appConfig.ICON_TYPE} name="chevron-forward" />
                </TouchableOpacity>
            </View>
        )
    }

    if (!isValidData(dataMenu)) return <View />
    return (
        <View style={styles.mainContainer}>
            <FlashList
                keyExtractor={(_item, index) => index.toString()}
                data={dataMenu}
                renderItem={renderItem}
                estimatedItemSize={50}
                numColumns={orientation == 'LANDSCAPE' ? 1 : 3}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={headerView}
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            />
        </View>
    )
}
export default MenuList;