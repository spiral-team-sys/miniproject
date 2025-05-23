import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { handlerGoBack } from '../../utils/helper';
import Header from '../../components/Header';
import { fontWeightBold } from '../../utils/utility';
import { Icon } from '@rneui/themed';
import { SheetManager } from 'react-native-actions-sheet';
import Loading from '../../components/Loading';
import ChangePassword from '../../components/employee/changePassword/ChangePassword';
import appConfig from '../../utils/appConfig/appConfig';
import ItemProfileInfo from '../../components/items/ItemProfileInfo';
import moment from 'moment';
import { KEYs } from '../../utils/storageKeys';

const AccountInfoScreen = ({ navigation }) => {
	const { userInfo } = useAuth();
	const { appColors } = useTheme();
	const [loading, setLoading] = useState(false);

	const onBack = () => {
		handlerGoBack(navigation);
	}
	const handlerPassword = () => {
		SheetManager.show(KEYs.ACTION_SHEET.PASSWORD_SHEET);
	}

	const styles = StyleSheet.create({
		mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
		contentMain: { backgroundColor: appColors.backgroundColor },
		contentHead: { alignItems: 'center', justifyContent: 'center' },
		contentInfo: { height: '100%', width: '100%' },
		nameStyle: { fontSize: 16, color: appColors.whiteColor, fontWeight: fontWeightBold, textAlign: 'center' },
		subNameStyle: { fontSize: 12, color: appColors.whiteColor, fontStyle: 'italic', textAlign: 'center' },
		frameInfo: { backgroundColor: appColors.cardColor, borderRadius: 6, margin: 12 },
		containerTitle: { flexDirection: 'row', alignItems: 'center', padding: 12 },
		containerFrame: { backgroundColor: appColors.primaryColor, minHeight: 210, borderBottomRightRadius: 30, borderBottomLeftRadius: 30 },
		titleFrame: { paddingHorizontal: 12, paddingTop: 12, fontWeight: fontWeightBold, color: appColors.textColor },
		titleInputPass: { color: appColors.darkColor, fontWeight: fontWeightBold },
		itemMain: { flex: 1 },
		itemStyle: { padding: 12, flexDirection: 'row', alignContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: appColors.borderColor },
		textItem: { fontSize: 13, flexGrow: 1, marginLeft: 12, fontWeight: fontWeightBold, color: appColors.textColor },
		titleHead: { fontSize: 14, paddingHorizontal: 12, paddingTop: 12, fontWeight: fontWeightBold, color: appColors.subTextColor },
	});

	const DetailView = ({ }) => {
		return (
			<View style={styles.itemMain}>
				<Text style={styles.titleHead}>Tài khoản</Text>
				<View style={styles.frameInfo}>
					<ItemProfileInfo title='Đăng nhập vào ' value={moment(userInfo?.server_time).format('dddd, DD/MM/YYYY')} iconName='phone-portrait-outline' />
					{/* Password */}
					<TouchableOpacity onPress={handlerPassword} style={styles.itemStyle}>
						<Icon type={appConfig.ICON_TYPE} color={appColors.primaryColor} name="lock-closed-outline" size={24} />
						<Text style={styles.textItem}>Mật khẩu</Text>
						<Icon type={appConfig.ICON_TYPE} color={appColors.textColor} name="chevron-forward-outline" size={24} />
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={styles.contentMain}>
				<View style={styles.containerFrame}>
					<Header title="Thông tin tài khoản" onLeftPress={onBack} />
					<View style={styles.contentHead}>
						<Icon type={appConfig.ICON_TYPE} raised color={appColors.primaryColor} name="person" size={42} />
						<Text style={styles.nameStyle}>{userInfo?.loginName}</Text>
					</View>
				</View>
				<View style={styles.contentInfo}>
					<DetailView />
				</View>
			</View>
			<Loading isLoading={loading} />
			<ChangePassword navigation setLoading={setLoading} />
		</SafeAreaView>
	);
};

export default AccountInfoScreen;
