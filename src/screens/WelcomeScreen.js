import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { deviceWidth } from '../styles/styles';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';
import { checkMultiplePermission, PERMISSTION_LIST, } from '../utils/permissions'
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';

FastImage.clearDiskCache();
FastImage.clearMemoryCache();

const WelcomeScreen = ({ navigation }) => {
    const { styleDefault, appColors } = useTheme()
    const { isLoggedIn } = useAuth()
    const dispatch = useDispatch()
    //
    useEffect(() => {
        checkMultiplePermission(PERMISSTION_LIST)
        const redirectToHome = async () => {
            if (isLoggedIn) {
                // if (appConfig.APPID == eoeApp) {
                //     const stateRoute = JSON.parse(await AsyncStorage.getItem(KEYs.STORAGE.LAST_VISIT_ROUTE) || '{}')
                //     await dispatch(setShopInfo(stateRoute.shopInfo || {}))
                //     await dispatch(setMenuReport(stateRoute.menuReportInfo || {}))
                //     await dispatch(setMenuHome(stateRoute.menuHomeInfo || {}))
                //     await navigation.replace(stateRoute.currentRouteName || 'MainApp');
                // } else {
                await navigation.replace('MainApp');
                // }
            } else {
                navigation.replace('Login');
            }
        };
        const timer = setTimeout(redirectToHome, 2000);
        return () => clearTimeout(timer);
    }, [isLoggedIn, navigation]);

    return (
        <SafeAreaView style={{ ...styleDefault.container, justifyContent: 'center', backgroundColor: appColors.primaryColor }}>
            <GradientBackground />
            <FastImage
                source={require('../assets/images/logo_spiral_white.png')}
                resizeMethod='scale'
                resizeMode='contain'
                placeholderStyle={{ backgroundColor: 'transparent' }}
                style={{ width: deviceWidth, height: 50, marginBottom: 12 }}
            />
            <ActivityIndicator size='small' color={appColors.lightColor} />
        </SafeAreaView>
    );
};

export default WelcomeScreen;
