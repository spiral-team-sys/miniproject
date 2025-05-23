import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import GradientBackground from '../../components/GradientBackground';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import AttendanceList from '../../components/lists/AttendanceList';
import { LOCATION_INFO } from '../../utils/locationInfo/LocationInfo';
import AttendanceMode from '../../components/attendance/AttendanceMode';
import FloatActionAudio from '../../components/floataction/FloatActionAudio';
import { KEYs } from '../../utils/storageKeys';
import { ATTENDANT_CONTROLLER } from '../../controllers/AttendanceController';
import { setLocationInfo } from '../../redux/actions';
import { SheetManager } from 'react-native-actions-sheet';
import ReportGuideline from '../../components/guideline/ReportGuideline';
import { handlerGoBack } from '../../utils/helper';
import appConfig, { eoeApp } from '../../utils/appConfig/appConfig';

const AttendanceScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme();
    const { shopInfo } = useSelector(state => state.shop)
    const { audioInfo } = useSelector(state => state.audio)
    const [distance, setDistance] = useState(0)
    const [isDoneReport, setDoneReport] = useState(false)
    const [modeValue, setModeValue] = useState('TC')
    const [menu, _setMenu] = useState({ isOpenCamera: false, isOpen: false, type: null, title: null })
    const [_mutate, setMutate] = useState(false)
    const dispatch = useDispatch()
    // 
    const LoadData = async () => {
        LOCATION_INFO.getCurrentLocation(async (info) => {
            const _distance = await LOCATION_INFO.getDistance(shopInfo.latitude, shopInfo.longitude, info.latitude, info.longitude)
            setDistance(_distance);
            dispatch(setLocationInfo(info))
        })
        //
        await ATTENDANT_CONTROLLER.GetDataMode({
            shopId: shopInfo.shopId,
            auditDate: shopInfo.auditDate
        }, (_mData, modeResult) => {
            setModeValue(modeResult.mode)
            setDoneReport(modeResult.isDoneReport == 1)
        })
    }
    // Handler
    const onShowMenuFAB = async () => {
        menu.isOpen = !menu.isOpen
        setMutate(e => !e)
    }
    const handlerChangeFAB = async (type) => {
        switch (type) {
            case "AUDIO":
                onRecord()
                break
            case "ALBUM":
                onShowAudio()
                break
        }
    }
    const onRecord = () => {
        if (audioInfo?.isRecorder) {
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_STOP)
        } else {
            menu.isOpen = false
            setMutate(e => !e)
            //
            const item = { isRecorder: true, reportId: -1, shopId: shopInfo.shopId, auditDate: shopInfo.auditDate }
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RECORD_START, item)
        }
    }
    const onShowAudio = () => {
        navigation.navigate('Gallary', { mode: 'AUDIO' })
    }
    const onShowChecked = () => {
        SheetManager.show(KEYs.ACTION_SHEET.CHECKED_SHEET)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => {
            isMounted = false
        }
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        customContentMain: { borderTopStartRadius: 0, borderTopEndRadius: 0 },
        recordView: { position: 'absolute', bottom: 32, end: 16 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={shopInfo.shopName}
                subTitle={`Khoảng cách ~ ${distance} m`}
                iconNameRight={modeValue == 'TC' ? 'reader-outline' : null}
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={modeValue == 'TC' ? onShowChecked : null}
            />
            <View style={[styleDefault.contentMain, styles.customContentMain]}>
                {/* // Content */}
                <AttendanceMode returnMode={setModeValue} />
                <AttendanceList navigation={navigation} />
            </View>
            {/* // Record */}
            {menu.isOpen && <TouchableOpacity style={styleDefault.overflowView} onPress={onShowMenuFAB} activeOpacity={0.65} />}
            <FloatActionAudio
                visible={appConfig.APPID == eoeApp || (shopInfo.record || 0) == 1}
                isDoneReport={isDoneReport}
                info={menu}
                showMenu={onShowMenuFAB}
                handlerChange={handlerChangeFAB}
            />
            {/* // Report Checked */}
            <ReportGuideline navigation={navigation} />
        </SafeAreaView>
    );
};
export default AttendanceScreen;
