import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import SyncData from '../../components/SyncData';
import useTheme from '../../hooks/useTheme';
import DashboardView from '../../components/dashboards/DashboardView';
import { fontWeightBold } from '../../utils/utility';
import MenuList from '../../components/lists/MenuList';

const HomeDefault = ({ props }) => {
    const { navigation } = props
    const { styleDefault, appColors } = useTheme()
    const [isRefreshData, setRefreshData] = useState(false)
    const syncRef = useRef(null)

    const handlerLoadData = () => {
        setRefreshData(e => !e)
    }

    const onRefreshData = () => {
        syncRef?.current?.onSyncData()
    }

    useEffect(() => {
        return () => false
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
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
                <Text style={styles.titleContent}>{'Chức năng'}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* // */}
            <SyncData ref={syncRef} onCompleted={handlerLoadData} />
            <Header title='Trang chủ' />
            <View style={styleDefault.contentMain}>
                <MenuList
                    isRefreshData={isRefreshData}
                    navigation={navigation}
                    headerView={renderDashboard}
                    onRefresh={onRefreshData}
                />
            </View>
        </SafeAreaView>
    );
};
export default HomeDefault;
