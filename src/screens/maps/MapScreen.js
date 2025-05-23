import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from "../../hooks/useTheme";
import Header from "../../components/Header";
import { handlerGoBack } from "../../utils/helper";
import GradientBackground from "../../components/GradientBackground";
import { SHOP_CONTROLLER } from "../../controllers/ShopController";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewCluster from 'react-native-map-clustering';
import { initialRegionDefault } from "../../utils/utility";
import { useDispatch, useSelector } from "react-redux";
import { setShopInfo } from "../../redux/actions";
import ShopInfoSheet from "../../components/bottomsheet/ShopInfoSheet";

const MapScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [dataMain, setDataMain] = useState([])
    const mapRef = useRef()
    const bottomSheetRef = useRef(null);
    const dispatch = useDispatch()
    //
    const LoadData = async () => {
        await SHOP_CONTROLLER.GetDataShop(setDataMain)
    }

    const handlerPressMarker = async (item) => {
        await dispatch(setShopInfo(item))
        if (bottomSheetRef.current && item.shopCode !== undefined)
            bottomSheetRef.current.snapToIndex(0)
    }

    const onStartWork = () => {
        bottomSheetRef.current.close()
        navigation.navigate('Work')
    }

    useEffect(() => {
        LoadData()
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentMap: { width: '100%', height: '100%' },
        mapPadding: { top: 0, left: 0, right: 0, bottom: 0 },
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Bản đồ'
                onLeftPress={() => handlerGoBack(navigation)}
            />
            <View style={styleDefault.contentMain}>
                <MapViewCluster
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    showsMyLocationButton
                    loadingEnabled
                    showsCompass
                    showsBuildings
                    showsUserLocation
                    showsTraffic
                    mapPadding={styles.mapPadding}
                    style={styles.contentMap}
                    initialRegion={initialRegionDefault}
                    loadingIndicatorColor={appColors.primaryColor}
                    clusterColor={appColors.errorColor}
                    clusterTextColor={appColors.whiteColor}
                    clusterBorderColor={appColors.errorColor}
                    clusterBorderWidth={2}>
                    {
                        dataMain.map((item, index) => {
                            if (item.latitude == null || item.longitude == null) return null;
                            const onPress = () => handlerPressMarker(item)
                            const colorMarker = item.colorMarker ? appColors[item.colorMarker] : item.isLockReport == 1 ? appColors.grayColor : appColors.errorColor;
                            return (
                                <Marker
                                    key={index}
                                    title={item.shopName}
                                    description={item.address}
                                    coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                                    pinColor={colorMarker}
                                    onPress={onPress}
                                />
                            );
                        })
                    }
                </MapViewCluster>
            </View>
            <ShopInfoSheet
                ref={bottomSheetRef}
                shopInfo={shopInfo}
                onStartWork={onStartWork}
                navigation={navigation}
            />
        </SafeAreaView>
    )
}
export default MapScreen;