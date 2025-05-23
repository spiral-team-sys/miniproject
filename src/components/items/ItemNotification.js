import React, { useState } from "react";
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from "react-native";
import useTheme from "../../hooks/useTheme";
import { Icon, ListItem, Text } from "@rneui/themed";
import { fontWeightBold } from "../../utils/utility";
import moment from "moment";
import { KEYs } from "../../utils/storageKeys";
import { NOTIFICATION_CONTROLLER } from "../../controllers/NotificationController";
import useNotificationManager from "../../hooks/useNotificationManager";
import appConfig from "../../utils/appConfig/appConfig";

const ItemNotification = ({ item, index, onReloadData }) => {
    const { appColors } = useTheme()
    const { handlerCountNotification } = useNotificationManager()
    const [_mutate, setMutate] = useState(false)

    const handlerShowDetail = async () => {
        item.sended = 2
        setMutate(e => !e)
        //
        await NOTIFICATION_CONTROLLER.SetReadNotification(item.id)
        await handlerCountNotification()
        DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.NOTIFICATION_SHEET_DETAILS, item)
    }
    const handlerDetele = async (reset) => {
        item.remove = 1
        setMutate(e => !e)
        //
        await NOTIFICATION_CONTROLLER.DeleteDataNotification([item], reset)
    }

    const styles = StyleSheet.create({
        itemMain: { width: '100%', borderBottomColor: appColors.borderColor, borderBottomWidth: 1 },
        titleGroupStyle: { padding: 8, fontSize: 13, fontWeight: fontWeightBold, color: appColors.subTextColor, backgroundColor: appColors.borderColor, borderBottomWidth: 0.5, borderColor: appColors.shadowColor },
        titleStyle: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8 },
        timeStyle: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor, textAlign: 'right', fontStyle: 'italic', position: 'absolute', end: 16 },
        bodyStyle: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor, padding: 16, paddingTop: 0 },
        detailStyle: { fontSize: 12, fontWeight: '500', color: appColors.primaryColor, textAlign: 'right', fontStyle: 'italic', paddingBottom: 8, paddingHorizontal: 16, textDecorationLine: 'underline' },
        contentTitle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
        viewStatus: { width: 8, height: 8, borderRadius: 8, backgroundColor: appColors.errorColor },
        contentSwipeable: { width: '100%', padding: 0 },
        buttonDelete: { flex: 1, backgroundColor: appColors.errorColor, alignItems: 'center', justifyContent: 'center' }
    })

    const renderContentDelete = (reset) => {
        const onPress = () => handlerDetele(reset)
        return (
            <TouchableOpacity style={styles.buttonDelete} onPress={onPress}>
                <Icon type={appConfig.ICON_TYPE} name='trash-outline' size={24} color={appColors.backgroundColor} />
            </TouchableOpacity>
        )
    }
    if (item.remove == 1) return <View />
    return (
        <View key={index} style={styles.itemMain}>
            {item.isParent && item.isChooseTag == 0 && item.groupName && <Text style={styles.titleGroupStyle}>{item.groupName}</Text>}
            <ListItem.Swipeable containerStyle={styles.contentSwipeable} rightContent={renderContentDelete} rightWidth={50} >
                <TouchableOpacity style={{ flex: 1 }} onPress={handlerShowDetail}>
                    <View style={styles.contentTitle}>
                        {item.sended !== 2 && <View style={styles.viewStatus} />}
                        <Text style={styles.titleStyle}>{item.title}</Text>
                        <Text style={styles.timeStyle}>{moment(item.createdDate).fromNow()}</Text>
                    </View>
                    <Text style={styles.bodyStyle} numberOfLines={2} ellipsizeMode='tail'>{item.body}</Text>
                    <Text style={styles.detailStyle}>Xem chi tiết</Text>
                </TouchableOpacity>
            </ListItem.Swipeable>
        </View>
    )
}

export default ItemNotification;