import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '../../components/GradientBackground';
import Header from '../../components/Header';
import SyncData from '../../components/SyncData';
import useTheme from '../../hooks/useTheme';
import { fontWeightBold } from '../../utils/utility';

const HomeBridgetone = ({ props }) => {
    const { navigation } = props
    const { styleDefault, appColors } = useTheme()
    const [isRefreshData, setRefreshData] = useState(false)
    const syncRef = useRef(null)
    //
    const handlerAlbum = () => {
        navigation.navigate('Gallary')
    }
    const handlerCreateLisence = () => {
        navigation.navigate('CreateLicense')
    }
    const handlerLoadData = () => {
        setRefreshData(e => !e)
    }
    const onRefreshData = () => {
        syncRef?.current?.onSyncData()
    }
    //
    useEffect(() => {
        return () => false
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        contentDashboardMain: { margin: 8 },
        contentDashboard: { width: '100%', minHeight: 240, backgroundColor: appColors.primaryColor, borderRadius: 8, marginTop: 8 },
        titleContent: { fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor, padding: 8 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            {/* // */}
            <SyncData ref={syncRef} onCompleted={handlerLoadData} />
            <Header
                title='Trang chủ'
                iconNameLeft='images'
                iconNameRight='add-circle'
                onLeftPress={handlerAlbum}
                onRightPress={handlerCreateLisence}
            />
            <View style={styleDefault.contentMain}>

            </View>
        </SafeAreaView>
    );
};
export default HomeBridgetone;
