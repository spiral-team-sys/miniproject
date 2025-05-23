import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import { useSelector } from "react-redux";
import { Platform, StyleSheet, View } from "react-native";
import ShopOverview from "../../components/infomation/shop/ShopOverview";
import ShopDetails from "../../components/infomation/shop/ShopDetails";

const ShopInfomationScreen = ({ navigation }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    //
    const LoadData = () => {

    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [shopInfo])
    //
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: '100%', backgroundColor: appColors.backgroundColor },
        contentOverview: { height: '30%', margin: 8, marginBottom: 0, borderRadius: 8, overflow: 'hidden' },
        contentDetails: { height: Platform.OS == 'ios' ? '53%' : '60%', margin: 8, marginBottom: 0, }
    })
    return (
        <View style={styles.mainContainer}>
            <View style={styles.contentOverview}>
                <ShopOverview navigation={navigation} />
            </View>
            <View style={styles.contentDetails}>
                <ShopDetails navigation={navigation} />
            </View>
        </View>
    )
}

export default ShopInfomationScreen;