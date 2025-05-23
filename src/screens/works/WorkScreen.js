import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import CustomTab from "../../components/CustomTab";
import { ShopReportScreen } from "./ShopReportScreen";
import { DATA_DEFAULT } from "../../utils/data/dataDefault";
import { handlerGoBack } from "../../utils/helper";
import ShopInfomationScreen from "./ShopInfomationScreen";
import GallaryReport from "../../components/gallary/GallaryReport";

const WorkScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [isReloadData, setReloadData] = useState(false)
    //
    const onBack = () => {
        handlerGoBack(navigation)
    }
    // Handler
    const handlerChangeTab = () => {
        setReloadData(e => !e)
    }
    //
    useEffect(() => {
        return () => false
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderItemTab = (item, index) => {
        switch (item.PageName) {
            case "ShopInfo":
                return <ShopInfomationScreen key={index} navigation={navigation} />
            case "WorkList":
                return <ShopReportScreen key={index} navigation={navigation} />
            case "Gallary":
                return <GallaryReport key={index} navigation={navigation} isReloadData={isReloadData} />
            default:
                return <View />
        }
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={shopInfo.shopName}
                onLeftPress={onBack}
            />
            {/* // Content Work */}
            <View style={styleDefault.contentMain}>
                <CustomTab
                    data={DATA_DEFAULT.dataWork}
                    appColors={appColors}
                    renderItem={renderItemTab}
                    onTabChange={handlerChangeTab}
                />
            </View>
        </SafeAreaView>
    )
}

export default WorkScreen;