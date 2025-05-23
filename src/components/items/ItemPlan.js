import React, { useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "@rneui/themed";
import moment from "moment";
import appConfig from "../../utils/appConfig/appConfig";
import { isValidField } from "../../utils/validateData";

const ItemPlan = ({ item, index }) => {
    const { appColors, styleDefault } = useTheme()
    const [_mutate, setMutate] = useState(false)

    const handlerChangeStatus = () => {
        item.status = item.status == 1 ? 0 : 1
        setMutate(e => !e)
    }

    const statusColor = item.status == 1 ? item.disabledStatus == 1 ? appColors.disabledColor : appColors.primaryColor : appColors.disabledColor
    const statusIcon = item.status == 1 ? 'checkbox' : 'square-outline'
    const styles = StyleSheet.create({
        itemMain: { flexDirection: 'row', width: '100%', padding: 8, borderBottomColor: appColors.borderColor, borderBottomWidth: 1 },
        contentTitle: { flex: 1 },
        subTitleTime: { fontSize: 11, fontWeight: '500', color: appColors.subTextColor, fontStyle: 'italic', textAlign: 'right', marginTop: 8, marginEnd: 8 },
        contentStatus: { alignSelf: 'center', padding: 8, paddingStart: 0 }
    })

    return (
        <View key={index} style={styles.itemMain}>
            <TouchableOpacity style={styles.contentStatus} onPress={handlerChangeStatus} disabled={item.disabledStatus == 1}>
                <Icon type={appConfig.ICON_TYPE} name={statusIcon} color={statusColor} size={24} />
            </TouchableOpacity>
            {/*  */}
            <View style={styles.contentTitle}>
                <Text style={styleDefault.titleName}>{`${index + 1}. ${item.shopName}`}</Text>
                <Text style={styleDefault.subTitleName}>{`ShopCode: ${item.shopCode}`}</Text>
                <Text style={styleDefault.subTitleName}>{`ĐC: ${item.address}`}</Text>
                <Text style={styleDefault.subTitleName}>{`Ca làm việc: ${item.shiftType} - ${item.shiftName}`}</Text>
                {!isValidField(item.updatedDate) && item.createdDate && <Text style={styles.subTitleTime}>{`Tạo bởi ${item.createdByName}: ${moment(item.createdDate).fromNow()}`}</Text>}
                {isValidField(item.updatedDate) && <Text style={styles.subTitleTime}>{`Câp nhật ${moment(item.updatedDate).fromNow()}`}</Text>}
            </View>
        </View >
    )
}

export default ItemPlan;