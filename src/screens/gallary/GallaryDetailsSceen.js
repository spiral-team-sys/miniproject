import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header'
import { handlerGoBack } from '../../utils/helper'
import GallaryReport from '../../components/gallary/GallaryReport'
import { useSelector } from 'react-redux'
import useTheme from '../../hooks/useTheme'
import { deviceHeight } from '../../styles/styles'
import GradientBackground from '../../components/GradientBackground'

const GallaryDetailsSceen = ({ navigation }) => {
    const { shopInfo } = useSelector(state => state.shop)
    const { appColors, styleDefault } = useTheme();

    const onBack = () => {
        handlerGoBack(navigation)
    }
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={shopInfo.shopName || shopInfo.shopCode}
                onLeftPress={onBack}
            />
            <View style={styleDefault.contentMain}>
                <GallaryReport navigation={navigation} />
            </View>
        </SafeAreaView>
    )
}
export default GallaryDetailsSceen