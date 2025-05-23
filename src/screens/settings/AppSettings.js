import { Icon } from "@rneui/base";
import { DeviceEventEmitter, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from "../../hooks/useTheme";
import { initializeDeviceInfo } from "../../utils/globals";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { AppFileSize, BackupData, handlerGoBack, messageConfirm } from "../../utils/helper";
import Header from "../../components/Header";
import appConfig from "../../utils/appConfig/appConfig";
import ItemSetting from "../../components/items/ItemSetting";
import useConnect from "../../hooks/useConnect";
import { connectionTypeTranslate } from "../../utils/utility";
import { SheetManager } from "react-native-actions-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYs } from "../../utils/storageKeys";
import Clipboard from '@react-native-clipboard/clipboard';
import TimeSlotSheet from "../../components/bottomsheet/TimeSlotSheet";
import FileDeleteSheet from "../../components/bottomsheet/FileDeleteSheet";
import _ from 'lodash'

const AppSettings = ({ navigation }) => {
    const { appColors, theme, toggleTheme } = useTheme()
    const { isOnlyWifi, connectionType, toggleConnect } = useConnect()
    const [autoDeleteInfo, setAutoDeleteInfo] = useState({})
    const [device, setDevice] = useState({})
    //
    const LoadData = async () => {
        await AsyncStorage.getItem(KEYs.STORAGE.AUTO_DELETE_PHOTO).then((value) => setAutoDeleteInfo(JSON.parse(value || '{}')))
        const deviceInfo = await initializeDeviceInfo()
        const appFileInfo = await AppFileSize()
        setDevice({ ...deviceInfo, "usedStore": appFileInfo.fileSize, "fileCount": appFileInfo.fileCount })
    }
    // Handler 
    const handlerAutoDeleteFile = () => {
        SheetManager.show(KEYs.ACTION_SHEET.FILE_DELETE_SHEET)
    }
    const handlerOnlyWifi = () => {
        const contentAlert = !isOnlyWifi
            ? 'Sau khi bật thiết lập này, ngoại trừ dữ liệu được đẩy lên hệ thống bằng 4G/Wifi, tất cả file hình ảnh và ghi âm sẽ chờ có kết nối Wifi mới gửi lên hệ thống.'
            : 'Sau khi tắt thiết lập này, ứng dụng sẽ sử dụng 4G/Wifi để đẩy toàn bộ dữ liệu, hình ảnh và ghi âm lên hệ thống.';
        messageConfirm('Thiết lập cài đặt', contentAlert, [{ text: 'Hủy' }, {
            text: 'Đồng ý', onPress: async () => {
                toggleConnect()
                !isOnlyWifi && SheetManager.show(KEYs.ACTION_SHEET.TIMESLOT_SHEET)
            }
        }]);
    }
    const handlerShowTimeSlot = () => {
        SheetManager.show(KEYs.ACTION_SHEET.TIMESLOT_SHEET)
    }
    // Action 
    const onCopyDeviceId = () => {
        Clipboard.setString(device.deviceId)
    }
    //
    useEffect(() => {
        const reload_setting = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_SETTING, LoadData)
        LoadData()
        return () => {
            reload_setting.remove()
        }
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
        contentMain: { backgroundColor: appColors.backgroundColor },
        contentInfoMain: { backgroundColor: appColors.primaryColor, minHeight: 210, borderBottomRightRadius: 30, borderBottomLeftRadius: 30 },
        contentItem: { height: '100%', width: '100%', padding: 8 },
        containerName: { marginLeft: 8 },
        lineBottomView: { paddingVertical: 3, paddingHorizontal: 20, marginVertical: 6, alignSelf: 'center', backgroundColor: appColors.lightColor, borderRadius: 40 },
        infoView: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: appColors.borderColor, padding: 8 },
        nameStyle: { fontSize: 15, fontWeight: '500', color: appColors.lightColor },
        subNameStyle: { fontSize: 13, color: appColors.lightColor },
        containDeviceId: { width: '90%', flexDirection: "row", alignItems: 'center' },
        buttonCopy: { marginLeft: 6 },
        iconDeviceView: { backgroundColor: 'red', borderRadius: 50 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.contentMain}>
                <View style={styles.contentInfoMain}>
                    <Header
                        title={"Cài đặt ứng dụng"}
                        backgroundColor='transparent'
                        onLeftPress={() => handlerGoBack(navigation)} />
                    <View style={styles.infoView}>
                        <Icon
                            raised
                            type={appConfig.ICON_TYPE}
                            color={appColors.primaryColor}
                            name='phone-portrait'
                            size={42} />
                        <View style={styles.containerName}>
                            <View style={styles.containDeviceId}>
                                <Text style={styles.nameStyle}>{`Mã thiết bị ${device.deviceId}`}</Text>
                                <TouchableOpacity style={styles.buttonCopy} onPress={onCopyDeviceId}>
                                    <Icon type={appConfig.ICON_TYPE} color={appColors.lightColor} name="clipboard" size={18} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.nameStyle}>Thiết bị {device.getModel}</Text>
                            <Text style={{ ...styles.nameStyle, marginBottom: 8 }}>{`Hệ điều hành ${Platform.OS} ${device.getSystemVersion}`}</Text>
                            <NumericFormat
                                value={device.getTotalDiskCapacity / (1024 * 1024 * 1024)}
                                thousandSeparator displayType="text"
                                decimalScale={0}
                                renderText={value => <Text style={styles.subNameStyle}>{`Tổng dung lượng ${value} Gb`}</Text>}
                            />
                            <NumericFormat
                                value={device.getFreeDiskStorage / (1024 * 1024 * 1024)}
                                thousandSeparator displayType="text"
                                decimalScale={0}
                                renderText={value => <Text style={styles.subNameStyle}>{`Dung lượng khả dụng ${value} Gb`}</Text>}
                            />
                            <NumericFormat
                                value={device.usedStore}
                                thousandSeparator displayType="text"
                                decimalScale={1}
                                renderText={value => <Text style={styles.subNameStyle}>{`Ứng dụng đã dùng ${value || 0} Mb`}</Text>}
                            />
                            <NumericFormat
                                value={device.fileCount}
                                thousandSeparator displayType="text"
                                decimalScale={0}
                                renderText={value => <Text style={styles.subNameStyle}>{`Tổng số file (hình ảnh / ghi âm) ${value || 0}`}</Text>}
                            />
                            <NumericFormat
                                value={device.getTotalMemory / (1024 * 1024 * 1024)}
                                thousandSeparator displayType="text"
                                decimalScale={0}
                                renderText={value => <Text style={styles.subNameStyle}>{`Bộ nhớ ram ${value} Gb`}</Text>}
                            />
                            <NumericFormat
                                value={device.getUsedMemory / (1024 * 1024)}
                                thousandSeparator displayType="text"
                                decimalScale={0}
                                renderText={value => <Text style={styles.subNameStyle}>{`Ram Sử dụng ${value} Mb`}</Text>}
                            />
                            <Text style={styles.subNameStyle}>Vị trí {device.isLocationEnabled ? "đang mở" : "đã tắt"}</Text>
                        </View>
                    </View>
                    <View style={styles.lineBottomView} />
                </View>
                <View style={styles.contentItem}>
                    <ItemSetting
                        isSwitch
                        title={theme == 'light' ? 'Chế độ sáng' : 'Chế độ tối'}
                        subTitle='Bấm để chuyển chế độ màu'
                        iconLefName={theme == 'light' ? 'sunny' : 'moon'}
                        valueChange={theme == 'dark'}
                        onPress={toggleTheme}
                    />
                    <ItemSetting
                        isSwitch
                        title='Thiết lập chỉ sử dụng Wifi'
                        subTitle={`Thiết bị của bạn đang sử dụng ${connectionTypeTranslate(connectionType)}`}
                        iconLefName={`${connectionType}-outline`}
                        valueChange={isOnlyWifi}
                        onSwitchChange={handlerOnlyWifi}
                        onPress={isOnlyWifi ? handlerShowTimeSlot : handlerOnlyWifi}
                    />
                    <ItemSetting
                        isSwitch
                        title='Thiết lập sử dụng sinh trắc học'
                        subTitle={`Bật chức năng khóa vân tay hoặc nhận diện khuân mặt`}
                        iconLefName='finger-print-outline'
                    />
                    <ItemSetting
                        title='Thiết lập xóa hình ảnh tự động'
                        subTitle={autoDeleteInfo.Description ? autoDeleteInfo.Description : `Xoá hình ảnh được lưu tạm trên ứng dụng`}
                        iconLefName='trash-outline'
                        iconRightName='chevron-forward'
                        onPress={handlerAutoDeleteFile}
                    />
                    <ItemSetting
                        title='Gửi phản hồi'
                        subTitle='Gửi thông tin dữ liệu trên máy của bạn cho bộ phận liên quan xử lí'
                        iconLefName='attach-outline'
                        iconRightName='chevron-forward'
                        onPress={BackupData}
                    />
                    <TimeSlotSheet />
                    <FileDeleteSheet />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default AppSettings;