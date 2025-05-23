import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import ActionSheet, { SheetManager } from 'react-native-actions-sheet'
import { Text } from 'react-native'
import CustomListView from '../lists/CustomListView'
import useTheme from '../../hooks/useTheme'
import { fontWeightBold } from '../../utils/utility'
import { Icon } from '@rneui/themed'
import appConfig from '../../utils/appConfig/appConfig'
import { getTimeInRange, alertConfirm } from '../../utils/helper'
import Button from '../button/Button'
import { KEYs } from '../../utils/storageKeys'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useConnect from '../../hooks/useConnect'
import { checkNotifeePermission } from '../../utils/permissions'
import notifee, { AndroidImportance } from '@notifee/react-native';
import useNotificationManager from '../../hooks/useNotificationManager'
import { toastError } from '../../utils/configToast'
import { isValidField } from '../../utils/validateData'

const TimeSlotSheet = ({ }) => {
    const { appColors } = useTheme()
    const { toggleConnect } = useConnect()
    const { triggerNotification } = useNotificationManager()
    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    //
    const LoadData = async () => {
        getTimeInRange(6, 22, 60, setData)
        await AsyncStorage.getItem(KEYs.STORAGE.TIME_SELECTED).then(async (value) => {
            setSelected(isValidField(value) ? JSON.parse(value || '[]') : [])
        })
    }
    // Handler
    const handlerItemTime = (item) => {
        if (selected.includes(item)) {
            setSelected((prev) => prev.filter((selected) => selected !== item));
        } else {
            setSelected((prev) => [...prev, item]);
        }
    };
    // Action
    const onCancel = async () => {
        alertConfirm('Thông báo', 'Bạn có đồng ý tắt thiết lập chỉ sử dụng Wifi?', () => {
            toggleConnect()
            SheetManager.hide(KEYs.ACTION_SHEET.TIMESLOT_SHEET)
        })
    }
    const onClose = () => {
        if (selected.length == 0)
            toggleConnect()
        SheetManager.hide(KEYs.ACTION_SHEET.TIMESLOT_SHEET)
    }
    const onConfirm = async () => {
        if (selected.length > 0) {
            await checkNotifeePermission();
            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'Important Notifications',
                importance: AndroidImportance.HIGH,
                vibration: true,
                vibrationPattern: [200, 500],
            });
            await SheetManager.hide(KEYs.ACTION_SHEET.TIMESLOT_SHEET)
            const hourSelected = selected.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
            await AsyncStorage.setItem(KEYs.STORAGE.TIME_SELECTED, JSON.stringify(hourSelected))

            const now = new Date();
            for (let i = 0; i < hourSelected.length; i++) {
                const hour = parseInt(hourSelected[i], 10);
                const notificationTime = new Date();
                notificationTime.setHours(hour, 0, 0, 0);

                if (notificationTime > now) {
                    await triggerNotification(notificationTime, channelId);
                } else {
                    const nextDayTime = new Date(notificationTime.getTime() + 24 * 60 * 60 * 1000);
                    await triggerNotification(nextDayTime, channelId);
                }
            }
        } else {
            toastError('Thông báo', 'Vui lòng chọn giờ trước khi xác nhận')
        }
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    //
    const styles = StyleSheet.create({
        titleSheet: { paddingVertical: 8, color: appColors.textColor, fontWeight: fontWeightBold, fontSize: 14, textAlign: 'center' },
        textCancel: { textAlign: 'center', color: appColors.errorColor },
        confirmButton: { backgroundColor: appColors.primaryColor, alignSelf: 'center', paddingHorizontal: 16 },
        cancelButton: { borderWidth: 1, borderColor: appColors.errorColor, backgroundColor: appColors.backgroundColor, alignSelf: 'center', paddingHorizontal: 16 },
        containButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
        listTime: { height: 300, width: '100%' },
        timeButton: { borderColor: appColors.primaryColor, margin: 5, padding: 8, borderWidth: 1, borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
        textPeriod: { color: appColors.textColor, fontSize: 14, fontWeight: fontWeightBold, padding: 8 },
        containTimeslot: { height: '100%', width: '100%' },
        textTime: { fontSize: 14 },
        buttonClose: { position: 'absolute', right: 8, top: 8 }
    })
    const renderTime = ({ item, index }) => {
        const isSelected = selected.includes(item);
        const backgroundColor = isSelected ? appColors.primaryColor : appColors.backgroundColor
        const color = isSelected ? appColors.lightColor : appColors.textColor
        const onPress = () => handlerItemTime(item, index)
        return (
            <TouchableOpacity style={{ ...styles.timeButton, backgroundColor }} onPress={onPress}>
                <Text style={{ ...styles.textTime, color }}>{`${item}h`}</Text>
            </TouchableOpacity>
        )
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.containTimeslot} key={index}>
                <Text style={styles.textPeriod}>{item.period}</Text>
                <CustomListView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderTime}
                    data={item.times}
                    extraData={item.times} />
            </View>
        );
    };
    return (
        <ActionSheet id={KEYs.ACTION_SHEET.TIMESLOT_SHEET}
            containerStyle={{ backgroundColor: appColors.backgroundColor }}
            closeOnTouchBackdrop={false}
            closeOnPressBack={false} >
            <Text style={styles.titleSheet}>{'Chọn thời gian hiển thị thông báo'}</Text>
            <View style={styles.buttonClose}>
                <TouchableOpacity onPress={onClose}>
                    <Icon type={appConfig.ICON_TYPE} name='close' />
                </TouchableOpacity>
            </View>
            <View style={styles.listTime}>
                <CustomListView
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                    data={data}
                    extraData={[data]}
                    renderItem={renderItem} />
            </View>
            <View style={styles.containButton}>
                <Button
                    style={styles.confirmButton}
                    title='Xác nhận'
                    onPress={onConfirm}
                />
                <Button
                    style={styles.cancelButton}
                    textStyle={styles.textCancel}
                    title='Hủy'
                    onPress={onCancel}
                />
            </View>
        </ActionSheet>
    )
}

export default TimeSlotSheet