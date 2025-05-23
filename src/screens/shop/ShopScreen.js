import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import { View } from "react-native";
import ShopList from "../../components/lists/ShopList";
import { SHOP_API } from "../../services/shopApi";
import appConfig, { eoeApp } from "../../utils/appConfig/appConfig";
import WorkingPlanList from "../../components/lists/WorkingPlanList";
import { useDispatch } from "react-redux";
import { clearShopInfo } from "../../redux/actions";

const ShopScreen = ({ navigation }) => {
    const { styleDefault } = useTheme()
    const dispatch = useDispatch()
    //
    const onRefresh = async () => {
        await SHOP_API.GetDataStoreList()
    }
    useEffect(() => {
        dispatch(clearShopInfo())
    }, [])

    const renderContent = () => {
        switch (appConfig.APPID) {
            case eoeApp:
                return <ShopList navigation={navigation} onRefresh={onRefresh} />
            default:
                return <WorkingPlanList navigation={navigation} onRefresh={onRefresh} />
        }
    }
    return (
        <View style={styleDefault.contentMain}>
            {renderContent()}
        </View>
    )
}

export default ShopScreen;