import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import { Divider, Icon } from '@rneui/base';
import { getVersion } from 'react-native-device-info';
import useAuth from '../../hooks/useAuth';
import { alertConfirm } from '../../utils/helper';
import ItemSetting from '../../components/items/ItemSetting';

const SettingsScreen = ({ navigation }) => {
    const { appColors } = useTheme()
    const { logout, userInfo } = useAuth()

    const handleLogout = () => {
        alertConfirm("Đăng xuất", "Bạn có muốn đăng xuất khỏi ứng dụng không?", logout)
    };
    const handlerSettings = () => {
        navigation.navigate('AppSetting')
    }
    const handlerEmployeeInfo = () => {
        navigation.navigate('EmployeeInfo')
    }
    const handlerAccountInfo = () => {
        navigation.navigate('AccountInfo')
    }
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
        contentMain: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentHead: { padding: 16, backgroundColor: appColors.primaryColor, minHeight: 200, borderBottomRightRadius: 30, borderBottomLeftRadius: 30 },
        contanerName: { padding: 12, },
        nameStyle: { fontSize: 16, color: appColors.whiteColor, fontWeight: '800', },
        subNameStyle: { fontSize: 12, color: appColors.whiteColor, fontStyle: 'italic' },
        contentDetailItem: { flex: 1, padding: 8 },
        circleView: {
            shadowColor: appColors.whiteColor, shadowRadius: 90, opacity: 0.9, shadowOpacity: 40, elevation: 7,
            position: 'absolute', backgroundColor: appColors.whiteColor, height: 160, width: 160, borderRadius: 160, right: -40, top: -80,
        },
        buttonLogout: { padding: 12, position: 'absolute', top: 3, right: 20 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.contentMain}>
                <View style={styles.contentHead}>
                    <Icon raised name='person-3' size={40} color={appColors.primaryColor} style={styles.iconLeft} />
                    <View style={styles.contanerName}>
                        <Text style={styles.nameStyle}>Họ & Tên {userInfo?.employeeName}</Text>
                        <Text style={styles.subNameStyle}>Mã nhân viên {userInfo?.employeeCode}</Text>
                    </View>
                    <View style={styles.circleView} />
                    <TouchableOpacity onPress={handleLogout} style={styles.buttonLogout}>
                        <Icon name='logout' size={23} color={appColors.primaryColor} />
                    </TouchableOpacity>
                </View>
                <View style={styles.contentDetailItem}>
                    <ItemSetting
                        title='Cài đặt'
                        iconLefName='settings'
                        iconRightName='chevron-forward'
                        onPress={handlerSettings}
                    />
                    <ItemSetting
                        title='Thông tin nhân viên'
                        iconLefName='person-circle'
                        iconRightName='chevron-forward'
                        onPress={handlerEmployeeInfo}
                    />
                    <ItemSetting
                        title='Thông tin tài khoản'
                        iconLefName='shield-checkmark'
                        iconRightName='chevron-forward'
                        onPress={handlerAccountInfo}
                    />
                </View>
                <Divider width={1} color={appColors.borderColor} />
                <ItemSetting
                    title={`Phiên bản ${getVersion()}`}
                    iconLefName='information-circle'
                />
            </View>
        </SafeAreaView>
    )
};
export default SettingsScreen;
