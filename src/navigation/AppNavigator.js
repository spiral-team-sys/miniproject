import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KEYs } from '../utils/storageKeys';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import HomeScreen from '../screens/home/HomeScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import AuditReportScreen from '../screens/reports/audit/eoe/AuditReportScreen';
import WorkScreen from '../screens/works/WorkScreen';
import GallaryScreen from '../screens/gallary/GallaryScreen';
import useAuth from '../hooks/useAuth';
import MapScreen from '../screens/maps/MapScreen';
import GallaryManagerScreen from '../screens/gallary/GallaryManagerScreen';
import AuditReportEditScreen from '../screens/reports/audit/eoe/AuditReportEditScreen';
import EmployeeInfoScreen from '../screens/profile/EmployeeInfoScreen';
import AccountInfoScreen from '../screens/profile/AccountInfoScreen';
import SummaryAuditScreen from '../screens/reports/audit/eoe/SummaryAuditScreen';
import GallaryDetailsSceen from '../screens/gallary/GallaryDetailsSceen';
import GalleryTimelineScreen from '../screens/gallary/GalleryTimelineScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DayPlanScreen from '../screens/plan/DayPlanScreen';
import WeekPlanScreen from '../screens/plan/WeekPlanScreen';
import MonthPlanScreen from '../screens/plan/MonthPlanScreen';
import SurveyReportScreen from '../screens/reports/survey/SurveyReportScreen';
import CameraReportScreen from '../screens/camera/CameraReportScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AppSettings from '../screens/settings/AppSettings';
import PopupView from '../components/webview/PopupView';
import QuickTestScreen from '../screens/quicktest/QuickTestScreen';
import DocumentScreen from '../screens/document/DocumentScreen';
import DocumentDetailScreen from '../screens/document/DocumentDetailsScreen';
import CreateLicenseScreen from '../screens/reports/adhoc/bridgetone/createLicense/CreateLicenseScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
	const { userInfo } = useAuth();
	//
	const onStateChange = async () => {
		await AsyncStorage.removeItem(KEYs.STORAGE.LAST_VISIT_ROUTE);
	};
	//
	useEffect(() => { }, [userInfo]);
	return (
		<NavigationContainer onStateChange={onStateChange}>
			<Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false, animation: 'fade' }}>
				<Stack.Screen name="MainApp" component={BottomTabNavigator} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="popup" component={PopupView} />
				<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
				<Stack.Screen name="AppSetting" component={AppSettings} />
				<Stack.Screen name="AuditReport" component={AuditReportScreen} />
				<Stack.Screen name="AuditReportEdit" component={AuditReportEditScreen} />
				<Stack.Screen name="SurveyReport" component={SurveyReportScreen} />
				<Stack.Screen name="Work" component={WorkScreen} />
				<Stack.Screen name="Attendance" component={AttendanceScreen} />
				<Stack.Screen name="Camera" component={CameraScreen} />
				<Stack.Screen name="CameraReport" component={CameraReportScreen} />
				<Stack.Screen name="Gallary" component={GallaryScreen} />
				<Stack.Screen name="GallaryManager" component={GallaryManagerScreen} />
				<Stack.Screen name="GallaryDetails" component={GallaryDetailsSceen} />
				<Stack.Screen name="GalleryTimeline" component={GalleryTimelineScreen} />
				<Stack.Screen name="Maps" component={MapScreen} />
				<Stack.Screen name="SummaryAudit" component={SummaryAuditScreen} />
				<Stack.Screen name="EmployeeInfo" component={EmployeeInfoScreen} />
				<Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
				<Stack.Screen name="DayPlan" component={DayPlanScreen} />
				<Stack.Screen name="WeekPlan" component={WeekPlanScreen} />
				<Stack.Screen name="MonthPlan" component={MonthPlanScreen} />
				<Stack.Screen name="QuickTest" component={QuickTestScreen} />
				<Stack.Screen name="Document" component={DocumentScreen} />
				<Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
				<Stack.Screen name="CreateLicense" component={CreateLicenseScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
