// Plan: Bật tắt shop theo ngày
import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import { handlerGoBack } from "../../utils/helper";
import { PLAN_API } from "../../services/planApi";
import WeekView from "../../components/calendar/WeekView";
import PlanList from "../../components/lists/PlanList";
import Loading from "../../components/Loading";

const DayPlanScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const [isLoading, setLoading] = useState(true)
    const [dataCalendar, setDataCalendar] = useState([])
    const [dataPlanMain, setDataPlanMain] = useState([])
    const [isRefreshData, setRefreshData] = useState(false)
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        setRefreshData(e => !e)
        await PLAN_API.GetDataCalendar(setDataCalendar)
        await setLoading(false)
    }
    const handlerUpdateData = async () => {
        !isLoading && await setLoading(true)
        await PLAN_API.UpdateDataPlan('DAY', dataPlanMain, LoadData)
        await setLoading(false)
    }
    const handlerChooseDay = async (item) => {
        !isLoading && await setLoading(true)
        await PLAN_API.GetDataPlanByDay(item.WorkingDay, setDataPlanMain)
        await setLoading(false)
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentShopList: { width: '100%', height: '90%' }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Lịch làm việc'
                iconNameRight='cloud-upload'
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={handlerUpdateData}
            />
            <View style={styleDefault.contentMain}>
                <Loading isLoading={isLoading} color={appColors.primaryColor} />
                <WeekView
                    isRefreshData={isRefreshData}
                    data={dataCalendar}
                    onChooseDay={handlerChooseDay} />
                <View style={styles.contentShopList}>
                    <PlanList dataMain={dataPlanMain} />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default DayPlanScreen;