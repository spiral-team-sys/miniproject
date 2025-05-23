import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "@rneui/themed";
import { fontWeightBold } from "../../utils/utility";
import { deviceWidth } from "../../styles/styles";
import { checkImageURL, processImagePath } from "../../utils/helper";
import appConfig from "../../utils/appConfig/appConfig";
import CachedImage from "../images/CachedImage";
import moment from "moment";

const ItemAttendance = ({ item, index, appColors, onPress, onLongPress }) => {
    const [photoSuccess, setPhotoSuccess] = useState({ status: false, url: null })
    const _photoPath = photoSuccess.url ? { uri: photoSuccess.url } : null
    const _colorStatus = photoSuccess.status ? appColors.successColor : appColors.warningColor
    //   
    const onPressItem = () => {
        onPress(item, (item?.photoPath || null) !== null)
    }
    const onLongPressItem = () => {
        onLongPress && onLongPress(item)
    }
    useEffect(() => {
        const isValidImage = async () => {
            if (item.photoPath) {
                const imageName = item.photoPath.substring(item.photoPath.lastIndexOf('/') + 1, item.photoPath.length);
                const validImage = await checkImageURL(`uploaded/${item.photoDate}/${imageName}`, item.photoPath)
                setPhotoSuccess(validImage)
            }
        }
        isValidImage()
    }, [item])

    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, textTransform: 'uppercase' },
        titleTime: { fontSize: 11, fontWeight: '500', color: appColors.errorColor },
        contentItem: {
            width: deviceWidth / 2.6, height: deviceWidth / 2.6, marginBottom: 8, backgroundColor: appColors.borderColor, alignItems: 'center', justifyContent: 'center', borderRadius: 150,
            elevation: 5, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.5, overflow: 'hidden'
        },
        imageStyle: { width: deviceWidth / 2.6, height: deviceWidth / 2.6 },
        iconStyle: { width: 100, height: 100 },
        bagdeStatus: {
            width: 32, height: 32, borderRadius: 24, backgroundColor: _colorStatus, borderWidth: 1, borderColor: appColors.borderColor,
            position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 38, end: 38
        }
    })
    return (
        <TouchableOpacity key={`item-shop-${index}`} style={styles.mainContainer} onPress={onPressItem}>
            <View style={styles.contentItem}>
                <CachedImage
                    uri={processImagePath(item.photoPath)}
                    requireSource={require('../../assets/images/face_attendance.png')}
                    resizeMode="cover"
                    style={item.photoPath ? styles.imageStyle : styles.iconStyle}
                    onPress={onPressItem}
                    onLongPress={onLongPressItem}
                />
            </View>
            <Text style={styles.titleName}>{`${item.title}`}</Text>
            {item.photoFullTime && <Text style={styles.titleTime}>{`${moment(item.photoFullTime).format('HH:mm:ss')}`}</Text>}
            {_photoPath !== null &&
                <View style={styles.bagdeStatus}>
                    <Icon type={appConfig.ICON_TYPE} name="checkmark" color={appColors.lightColor} size={18} />
                </View>
            }
        </TouchableOpacity>
    )
}
export default ItemAttendance;