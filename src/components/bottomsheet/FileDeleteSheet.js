import React, { useEffect, useState } from 'react'
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import ActionSheet, { SheetManager } from 'react-native-actions-sheet'
import useTheme from '../../hooks/useTheme'
import { DATA_DEFAULT } from '../../utils/data/dataDefault'
import CustomListView from '../lists/CustomListView'
import { fontWeightBold } from '../../utils/utility'
import FieldInput from '../fields/FieldInput'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KEYs } from '../../utils/storageKeys'
import Button from '../button/Button'
import moment from 'moment'
import { isValidData, isValidField, isValidObject } from '../../utils/validateData'
import { alertConfirm } from '../../utils/helper'
import _ from 'lodash'

const FileDeleteSheet = ({ }) => {
    const { appColors } = useTheme()
    const [itemTime, setItemTime] = useState({})
    const [_mutate, setMutate] = useState(false)

    const LoadData = async () => {
        await AsyncStorage.getItem(KEYs.STORAGE.AUTO_DELETE_PHOTO).then((value) => {
            const itemInfo = JSON.parse(value || '{}')
            if (isValidObject(itemInfo))
                setItemTime(itemInfo)
            else
                setItemTime({ data: DATA_DEFAULT.dataAutoDelete })
        })
    }
    // Handler
    const handleSelectItem = async (item) => {
        const valueChoose = !(item.isChoose || false)
        const dataUpdate = _.map(itemTime.data, (e) => {
            if (e.ItemId == item.ItemId)
                return { ...e, isChoose: valueChoose }
            return { ...e, isChoose: false }
        })
        setItemTime({ ...item, isChoose: valueChoose, data: dataUpdate })
    }
    const handlerValid = () => {
        let _error = null
        if (itemTime.Code == 'DAYS') {
            if (isValidField(itemTime.DateValue)) {
                _error = `Vui lòng nhập số ngày mà bạn muốn xoá tự động`
            } else {
                if (itemTime.DateValue == 0) {
                    _error = `Vui lòng nhập số ngày lớn hơn 0`
                }
            }
        }
        if (isValidField(_error)) {
            itemTime.strError = _error
            setMutate(e => !e)
            return false
        }
        return true
    }
    // Action
    const onChangeText = async (text) => {
        const value = isValidData(text) ? parseInt(text) : null
        const dateValue = moment().add(value, 'day').format('YYYYMMDD')
        itemTime.RangeValue = value
        itemTime.DateValue = dateValue
        itemTime.Description = `Hình ảnh tự động xóa sau ${value} ngày`
        setMutate(e => !e)
    }
    const onConfirm = async () => {
        const isValid = handlerValid()
        if (!isValid)
            return
        await SheetManager.hide(KEYs.ACTION_SHEET.FILE_DELETE_SHEET)
        await AsyncStorage.setItem(KEYs.STORAGE.AUTO_DELETE_PHOTO, JSON.stringify(itemTime))
        await DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_SETTING)
    }
    const onCancel = async () => {
        if (itemTime.isChoose)
            alertConfirm('Thông báo', 'Bạn có đồng ý tắt thiết lập tự động xoá hình ảnh không?', async () => {
                setItemTime({ data: DATA_DEFAULT.dataAutoDelete })
                await AsyncStorage.removeItem(KEYs.STORAGE.AUTO_DELETE_PHOTO)
                await SheetManager.hide(KEYs.ACTION_SHEET.FILE_DELETE_SHEET)
                await DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_SETTING)
            })
        else
            await SheetManager.hide(KEYs.ACTION_SHEET.FILE_DELETE_SHEET)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { backgroundColor: appColors.backgroundColor },
        mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        textCancel: { textAlign: 'center', color: appColors.errorColor },
        containList: { height: 50, width: '100%', marginVertical: 10 },
        titleSheet: { textAlign: 'center', fontWeight: fontWeightBold, color: appColors.textColor, marginVertical: 8 },
        buttonTime: { borderWidth: 1, borderColor: appColors.primaryColor, width: 80, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
        buttonConfirm: { alignSelf: 'center', backgroundColor: appColors.primaryColor, marginVertical: 16, paddingHorizontal: 16 },
        buttonCancel: { borderWidth: 1, borderColor: appColors.errorColor, backgroundColor: appColors.backgroundColor, alignSelf: 'center', paddingHorizontal: 16 },
        description: { textAlign: 'center', fontWeight: fontWeightBold, color: appColors.errorColor, fontStyle: 'italic', fontSize: 13 },
        containButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => handleSelectItem(item)
        const isActive = item.isChoose
        const color = isActive ? appColors.lightColor : appColors.textColor
        const backgroundColor = isActive ? appColors.primaryColor : appColors.backgroundColor
        return (
            <View key={index} style={styles.mainContent}>
                <Button
                    title={item.ItemName}
                    style={{ ...styles.buttonTime, backgroundColor }}
                    textStyle={{ color }}
                    onPress={onPress}
                />
            </View>
        )
    }
    return (
        <ActionSheet id={KEYs.ACTION_SHEET.FILE_DELETE_SHEET} containerStyle={styles.mainContainer} closable={false}>
            <Text style={styles.titleSheet}>{itemTime.Description || 'Chọn mốc thời gian'}</Text>
            <View style={styles.containList}>
                <CustomListView
                    numColumns={4}
                    data={itemTime.data}
                    renderItem={renderItem}
                />
            </View>
            <FieldInput
                defaultValue={`${itemTime.RangeValue || ''}`}
                error={itemTime.strError}
                visible={itemTime.ItemCode == 'DAYS' && itemTime.isChoose}
                placeholder='Nhập số ngày hình ảnh sẽ được xoá (VD: 10 ngày)'
                keyboardType='number-pad'
                onChangeText={onChangeText}
            />
            <View style={styles.containButton}>
                <Button
                    title={itemTime.isChoose ? 'Hủy thiết lập' : 'Đóng'}
                    style={styles.buttonCancel}
                    textStyle={styles.textCancel}
                    onPress={onCancel}
                />
                <Button
                    title='Xác nhận'
                    style={styles.buttonConfirm}
                    onPress={onConfirm}
                />
            </View>
        </ActionSheet>
    )
}
export default FileDeleteSheet