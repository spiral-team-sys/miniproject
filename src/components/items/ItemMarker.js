import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { isValidData } from "../../utils/validateData";
import useTheme from "../../hooks/useTheme";

const ItemMarker = ({ data, onPressMarker }) => {
    const { appColors } = useTheme()
    const [dataMarker, setDataMarker] = useState([])
    //
    useEffect(() => {
        const LoadData = () => {
            setDataMarker(data)
        }
        LoadData()
    }, [data])
    //
    const renderItem = (item, index) => {
        const onPress = () => {
            onPressMarker && onPressMarker(item)
        }
        const colorMarker = item.colorMarker ? appColors[item.colorMarker] : (item.isLockReport == 1 ? appColors.grayColor : appColors.errorColor)
        if (item.latitude == null || item.longitude == null) return <View key={index} />
        return (
            <Marker
                key={index}
                title={item.shopName}
                description={item.address}
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                pinColor={colorMarker}
                onPress={onPress} >
            </Marker>
        )
    }
    if (!isValidData(dataMarker))
        return <View />
    return dataMarker.map(renderItem)
}
export default ItemMarker;