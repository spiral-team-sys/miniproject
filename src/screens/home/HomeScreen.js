import React, { useEffect } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import appConfig, { eoeApp, adhocApp, hmerApp, brsApp } from '../../utils/appConfig/appConfig';
import HomeEOE from './HomeEOE';
import HomeDefault from './HomeDefault';
import GradientBackground from '../../components/GradientBackground';
import useTheme from '../../hooks/useTheme';
import HomeAdhocScreen from './HomeAdhocScreen';
import { hvnStockApp } from '../../utils/appConfig/projectConfigCode';
import useAuth from '../../hooks/useAuth';
import { REPORT_API } from '../../services/reportApi';
import useConnect from '../../hooks/useConnect';
import { toastInfo } from '../../utils/configToast';
import notifee, { EventType } from '@notifee/react-native';
import { REPORT_CONTROLLER } from '../../controllers/ReportController';
import { useDispatch } from 'react-redux';
import { setMenuHome } from '../../redux/actions';
import HomeBridgetone from './HomeBridgetone';

const HomeScreen = (props) => {
    const insets = useSafeAreaInsets()
    const { userInfo } = useAuth()
    const { appColors } = useTheme()
    const { isOnlyWifi, connectionType } = useConnect()
    const dispatch = useDispatch()

    const handlerUploadReportPending = async () => {
        await REPORT_CONTROLLER.GetDataReportPendingUpload(async (mData) => {
            for (let index = 0; index < mData.length; index++) {
                const item = mData[index];
                await REPORT_API.UploadDataReport(item, async (result) => {
                    result.messeger && toastSuccess('Thông báo', result.messeger)
                })
            }
        })
    }

    useEffect(() => {
        const checkAndUpload = () => {
            if ((userInfo?.employeeId || 0) > 0) {
                // Gửi báo cáo Pending
                setTimeout(async () => { await handlerUploadReportPending() }, 120000);
                // Thiết lập gửi file bằng Wifi
                if (!isOnlyWifi || (isOnlyWifi && connectionType == 'wifi')) {
                    setTimeout(async () => { await REPORT_API.UploadFileReport() }, 120000);
                } else {
                    toastInfo('Thông báo', `Đã bật thiết lập chỉ sử dụng Wifi, Nên dữ liệu hình ảnh và ghi âm sẽ chờ tới khi có wifi mới gửi lên hệ thống`);
                }
            }
        };
        checkAndUpload();
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkAndUpload();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                if (Platform.OS === 'ios') {
                    if (detail.notification.ios.categoryId === 'openReportScreen') {
                        dispatch(setMenuHome({ id: 33, menuNameVN: "Theo dõi kết quả" }))
                        props.navigation.navigate('SummaryAudit');
                    }
                } else {
                    if (detail.pressAction?.id === 'openReportScreen') {
                        dispatch(setMenuHome({ id: 33, menuNameVN: "Theo dõi kết quả" }))
                        props.navigation.navigate('SummaryAudit');
                    }
                }
            }
        });

        return () => {
            unsubscribe()
        };
    })
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            if (Platform.OS === 'ios') {
                if (detail.notification.ios.categoryId === 'openReportScreen') {
                    dispatch(setMenuHome({ id: 33, menuNameVN: "Theo dõi kết quả" }))
                    props.navigation.navigate('SummaryAudit');
                }
            } else {
                if (detail.pressAction?.id === 'openReportScreen') {
                    dispatch(setMenuHome({ id: 33, menuNameVN: "Theo dõi kết quả" }))
                    props.navigation.navigate('SummaryAudit');
                }
            }
        }
    });



    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentMain: { flex: 1 }
    })
    const renderUI = () => {
        switch (appConfig.APPID) {
            case eoeApp:
                return <HomeEOE props={props} />
            case hmerApp:
            case hvnStockApp:
            case adhocApp:
                return <HomeAdhocScreen props={props} />
            case brsApp:
                return <HomeBridgetone props={props} />
            default:
                return <HomeDefault props={props} />
        }
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <View style={styles.contentMain}>
                {renderUI()}
            </View>
        </SafeAreaView>
    );
};
export default HomeScreen;
