import React, { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import SyncData from "../../components/SyncData";
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import { Text } from "@rneui/themed";
import MenuList from "../../components/lists/MenuList";
import { fontWeightBold } from "../../utils/utility";
import DashboardView from "../../components/dashboards/DashboardView";

const HomeAdhocScreen = ({ props }) => {
    const { navigation } = props
    const { appColors, styleDefault } = useTheme()
    const [isRefreshData, setRefreshData] = useState(false)
    const refSync = useRef()

    const LoadData = async () => {
        setRefreshData(e => !e)
    }
    // Handler
    const onRefreshData = () => {
        refSync?.current?.onSyncData()
    }

    useEffect(() => {
        return () => false
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentDashboardMain: { margin: 8 },
        contentDashboard: { width: '100%', minHeight: 240, backgroundColor: appColors.primaryColor, borderRadius: 8, marginTop: 8 },
        titleContent: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8 }
    })

    const renderDashboard = () => {
        return (
            <View style={styles.contentDashboardMain}>
                <View style={styles.contentDashboard}>
                    <DashboardView navigation={navigation} isRefresh={isRefreshData} />
                </View>
                <Text style={styles.titleContent}>Chức năng</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <SyncData ref={refSync} onCompleted={LoadData} />
            <GradientBackground />
            <Header title='TRANG CHỦ' />
            <View style={styleDefault.contentMain}>
                <MenuList
                    isRefreshData={isRefreshData}
                    navigation={navigation}
                    headerView={renderDashboard}
                    onRefresh={onRefreshData} />
            </View>
        </SafeAreaView>
    )
}

export default HomeAdhocScreen;