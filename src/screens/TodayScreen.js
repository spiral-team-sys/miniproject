import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapRoute from "./maps/MapRoute";
import Loading from "../components/Loading";
import useTheme from "../hooks/useTheme";
import ShopScreen from "./shop/ShopScreen";
import GradientBackground from "../components/GradientBackground";
import Header from "../components/Header";
import { LOCATION_INFO } from "../utils/locationInfo/LocationInfo";
import { ATTENDANCE_API } from "../services/attendanceApi";
import { messageConfirm } from "../utils/helper";
import { setStatusWorking } from "../redux/actions";
import appConfig, { eoeApp } from "../utils/appConfig/appConfig";
import moment from "moment";

const TodayScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { statusInfo } = useSelector(state => state.status)
    const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    //
    const LoadData = async () => {
        if (appConfig.APPID == eoeApp) {
            await setLoading(true)
            await ATTENDANCE_API.updateWorkingStatus([], (info) => {
                dispatch(setStatusWorking(info))
            })
            await setLoading(false)
        } else {
            setLoading(false)
        }
    }
    const onChangeStatus = async () => {
        await LOCATION_INFO.getCurrentLocation(async (locationInfo) => {
            const data = [{
                workTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                locationValue: `${locationInfo.latitude},${locationInfo.longitude}`
            }]
            await ATTENDANCE_API.updateWorkingStatus(data, (info) => {
                dispatch(setStatusWorking(info))
            })
        })
    }
    // Handler 
    const handlerShowMap = () => {
        navigation.navigate('Maps')
    }
    const handlerChangeStatus = () => {
        if (statusInfo.statusId !== 2) {
            const options = [{ text: 'Không' }, { text: 'Đồng ý', onPress: onChangeStatus }]
            messageConfirm('Thông báo', `Bạn có muốn ${statusInfo.statusId > 0 ? `Kết thúc làm việc` : `Bắt đầu làm việc`} không?`, options)
        }
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderContent = () => {
        if (isLoading)
            return <Loading isLoading={isLoading} color={appColors.primaryColor} />
        switch (appConfig.APPID) {
            case eoeApp:
                return <MapRoute navigation={navigation} />
            default:
                return <ShopScreen navigation={navigation} />
        }
    }
    const renderHeader = () => {
        switch (appConfig.APPID) {
            case eoeApp:
                return <Header
                    title={statusInfo.statusWorking || 'Bắt đầu làm việc'}
                    subTitle={statusInfo.timeWorking}
                    iconNameRight='map'
                    iconNameLeft={statusInfo.statusId == 0 ? 'play-circle-outline' : (statusInfo.statusId == 1 ? 'stop-circle-outline' : 'checkmark-done-circle-outline')}
                    onLeftPress={handlerChangeStatus}
                />
            default:
                return <Header
                    title='Danh sách cửa hàng'
                    iconNameRight='map'
                    onRightPress={handlerShowMap}
                />
        }
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            {renderHeader()}
            <View style={styleDefault.contentMain}>
                {renderContent()}
            </View>
        </SafeAreaView>
    )
}
export default TodayScreen;