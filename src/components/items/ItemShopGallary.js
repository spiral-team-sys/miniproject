import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";

const ItemShopGallary = ({ item, index, appColors, styleDefault, onPress }) => {
    const onPressItem = () => {
        onPress(item, index)
    }
    const styles = StyleSheet.create({
        mainContainer: {
            padding: 8, margin: 8, marginBottom: 0, backgroundColor: appColors.cardColor, borderRadius: 8,
            elevation: 3, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.3,
            borderStartWidth: 5, borderColor: appColors.primaryColor
        },
    })

    return (
        <TouchableOpacity key={`item-shop-${index}`} style={styles.mainContainer} onPress={onPressItem}>
            <Text style={styleDefault.titleName}>{`${index + 1}. ${item.shopName || `ShopCode: ${item.shopCode}`}`}</Text>
            <Text style={styleDefault.subTitleName}>{`ShopCode: ${item.shopCode}`}</Text>
            <Text style={styleDefault.subTitleName}>{`Đc: ${item.address || 'Không có dữ liệu'}`}</Text>
        </TouchableOpacity>
    )
}

export default ItemShopGallary;