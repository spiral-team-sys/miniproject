import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import { MASTER_CONTROLLER } from "../../../controllers/MasterController";
import CustomListView from "../../lists/CustomListView";
import FieldInput from "../../fields/FieldInput";

const ShopDetails = ({ navigation }) => {
    const { shopInfo } = useSelector(state => state.shop)
    const [dataDetail, setDataDetail] = useState([])
    //
    const LoadData = async () => {
        await MASTER_CONTROLLER.GetDataMaster({ listCode: 'STOREINFO' }, setDataDetail)
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
        mainContainer: { flex: 1, paddingVertical: 8 }
    })
    const renderItem = ({ item, index }) => {
        return (
            <FieldInput
                key={index}
                disabled
                multiline
                label={item.nameVN}
                value={shopInfo[item.ref_Code] || 'Không có dữ liệu'}
            />
        )
    }
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                data={dataDetail}
                renderItem={renderItem}
            />
        </View>
    )
}

export default ShopDetails;