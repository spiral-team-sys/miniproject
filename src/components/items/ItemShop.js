import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";
import { useSelector } from "react-redux";
import { VALID_CONTROLLER } from "../../controllers/ValidController";

const ItemShop = ({ item, index, appColors, styleDefault, onPress }) => {
    const [isDone, setDone] = useState(0)
    //
    const LoadData = async () => {
        await VALID_CONTROLLER.attendanceDone(item, setDone)
    }
    const onPressItem = () => {
        onPress(item, index)
    }
    useEffect(() => {
        LoadData()
    }, [item])
    //
    const styles = StyleSheet.create({
        mainContainer: {
            padding: 8, margin: 8, marginBottom: 0, backgroundColor: appColors.cardColor, borderRadius: 8,
            elevation: 3, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.3,
            borderStartWidth: 5, borderColor: isDone == 2 ? appColors.primaryColor : isDone == 1 ? appColors.warningColor : appColors.errorColor
        }
    })
    return (
        <TouchableOpacity key={`item-shop-${index}`} style={styles.mainContainer} onPress={onPressItem}>
            <Text style={styleDefault.titleName}>{`${index + 1}. ${item.shopName}`}</Text>
            <Text style={styleDefault.subTitleName}>{`Đc: ${item.address}`}</Text>
            {item.subSegment && <Text style={styles.subTitleName}>{`Loại hình: ${item.subSegment}`}</Text>}
        </TouchableOpacity>
    )
}

export default ItemShop;