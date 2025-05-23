import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { handlerGoBack } from '../../utils/helper';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { Icon } from '@rneui/themed';
import { EMPLOYEE_API } from '../../services/employeeApi';
import moment from 'moment';
import { toastError } from '../../utils/configToast';
import appConfig from '../../utils/appConfig/appConfig';
import { fontWeightBold } from '../../utils/utility';
import CustomListView from '../../components/lists/CustomListView';
import ItemProfileInfo from '../../components/items/ItemProfileInfo';
import Loading from '../../components/Loading';
import { deviceHeight } from '../../styles/styles';

const EmployeeInfoScreen = ({ navigation }) => {
	const { userInfo } = useAuth()
	const { appColors } = useTheme()
	const [isLoading, setLoading] = useState(false)
	const [data, setData] = useState([])

	const LoadData = async () => {
		await setLoading(true)
		await EMPLOYEE_API.GetInfomation(async (dataEmployee, messeger) => {
			messeger && toastError(messeger)
			setData(dataEmployee)
		})
		await setLoading(false)
	}
	const onBack = () => {
		handlerGoBack(navigation);
	}

	useEffect(() => {
		LoadData()
	}, [])

	const styles = StyleSheet.create({
		mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
		contentMain: { width: '100%', height: deviceHeight, backgroundColor: appColors.backgroundColor },
		contentHead: { alignItems: 'center', justifyContent: 'center' },
		contentInfo: { flex: 1 },
		itemMain: { flex: 1 },
		nameStyle: { fontSize: 16, color: appColors.whiteColor, fontWeight: fontWeightBold },
		frameInfo: { backgroundColor: appColors.cardColor, borderRadius: 6, margin: 12, paddingBottom: 12 },
		containerFrame: { backgroundColor: appColors.primaryColor, minHeight: 210, borderBottomRightRadius: 30, borderBottomLeftRadius: 30 },
		titleInfo: { fontSize: 14, fontWeight: 'bold', color: appColors.subTextColor, paddingHorizontal: 12, paddingTop: 8, fontStyle: 'italic' }
	});
	const renderItem = ({ item, index }) => {
		return (
			<View key={`info_${index}`} style={styles.itemMain}>
				<Text style={styles.titleInfo}>Thông tin cá nhân</Text>
				<View style={styles.frameInfo}>
					<ItemProfileInfo title='Họ và tên: ' value={item.employeeName} iconName='person-circle-outline' />
					<ItemProfileInfo title='Mã nhân viên: ' value={item.employeeCode} iconName='id-card-outline' />
					<ItemProfileInfo title='Giới tính: ' value={item.gender} iconName='transgender-outline' />
					<ItemProfileInfo title='Vị trí: ' value={item.positionName} iconName='briefcase-outline' />
					<ItemProfileInfo title='Ngày vào làm: ' value={moment(item.workingDate).format('DD/MM/YYYY')} iconName='calendar-outline' />
				</View>
				<Text style={styles.titleInfo}>Thông tin liên hệ</Text>
				<View style={styles.frameInfo}>
					<ItemProfileInfo title='Số điện thoại: ' value={item.mobile} iconName='call-outline' />
					<ItemProfileInfo title='Email: ' value={item.email} iconName='mail-outline' />
					<ItemProfileInfo title='Địa chỉ nhà: ' value={item.householdAddress} iconName='location-outline' />
					<ItemProfileInfo title='Địa chỉ tạm trú: ' value={item.residentAddress} iconName='location-outline' />
				</View>
			</View>
		)
	}
	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={styles.contentMain}>
				<View style={styles.containerFrame}>
					<Header title="Thông tin nhân viên" onLeftPress={onBack} />
					<View style={styles.contentHead}>
						<Icon type={appConfig.ICON_TYPE} raised color={appColors.primaryColor} name="person" size={42} />
						<Text style={styles.nameStyle}>{userInfo.employeeName}</Text>
					</View>
				</View>
				<View style={styles.contentInfo}>
					<Loading isLoading={isLoading} color={appColors.primaryColor} />
					<CustomListView
						data={data}
						extraData={[data]}
						renderItem={renderItem}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default EmployeeInfoScreen;
