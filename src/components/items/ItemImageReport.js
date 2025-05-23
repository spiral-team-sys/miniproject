import { Icon, Text } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { formatDateTimeVN, processImagePath } from '../../utils/helper';
import useTheme from '../../hooks/useTheme';
import { deviceWidth } from '../../styles/styles';
import { fontWeightBold } from '../../utils/utility';
import CachedImage from '../images/CachedImage';
import appConfig from '../../utils/appConfig/appConfig';
import RNFS from 'react-native-fs'
const ItemImageReport = ({ item, index, photos, handlerShowImage, handlerDeleteImage }) => {
    const { appColors } = useTheme()
    const [statusImageColor, setStatusImageColor] = useState(0);
    const [itemShow, setItemShow] = useState({})
    const [fileExist, setFileExists] = useState(null)
    const LoadData = async () => {
        // const pathServer = `uploaded/${item.photoDate}/${item.photoName}`;
        // const result = await checkImageURL(pathServer, item.photoPath);
        // if (result.status && item.fileUpload == 1) {
        //     setStatusImageColor(appColors.successColor)
        // } else {
        RNFS.exists(item.photoPath).then(value => setFileExists(value))
        if (item.fileUpload == 1) {
            setStatusImageColor(appColors.successColor)
        } else {
            setStatusImageColor(appColors.errorColor)
        }
        // }
        //
        setItemShow(item)
    }
    const onPressImage = () => {
        handlerShowImage && handlerShowImage(index, item, photos);
    };

    const onPressDelete = () => {
        handlerDeleteImage && handlerDeleteImage(item)
    }

    useEffect(() => {
        let isMounted = true
        if (!isMounted) return
        LoadData()
        return () => { isMounted = false }
    }, [item, itemShow]);

    const styles = StyleSheet.create({
        itemMainPhoto: { marginBottom: 5, borderWidth: 1, borderColor: appColors.borderColor, borderRadius: 5, overflow: 'hidden' },
        imageStyle: { width: (deviceWidth / 3.2), height: deviceWidth / 3 },
        titlePhotoName: { fontSize: 11, color: appColors.textColor, fontWeight: '500', textAlign: 'center', padding: 5, paddingBottom: 0 },
        titlePhotoTime: { fontSize: 11, color: appColors.textColor, fontWeight: fontWeightBold, textAlign: 'center', paddingBottom: 5 },
        statusView: { width: 12, height: 12, borderRadius: 10, backgroundColor: statusImageColor, position: 'absolute', top: 3, end: 3, borderWidth: 1, borderColor: appColors.lightColor },
        opacityView: { width: '100%', height: '100%', backgroundColor: appColors.opacityColor, opacity: 0.5, zIndex: 1, position: 'absolute' },
        iconRemoveView: { position: 'absolute', justifyContent: 'center', top: 0, bottom: 0, end: 0, start: 0, zIndex: 2, padding: 8 },
    })

    return (
        <TouchableOpacity
            key={`photo_${index}`}
            style={styles.itemMainPhoto}
            onLongPress={onPressDelete}
        >
            {fileExist ?
                <CachedImage
                    uri={processImagePath(itemShow.photoPath)}
                    style={styles.imageStyle}
                    resizeMode="cover"
                    onPress={onPressImage}
                /> : <Image resizeMethod="scale"
                    resizeMode="center" style={styles.imageStyle}
                    source={require('../../assets/images/filenotfound.png')} />
            }
            <View style={styles.statusView} />
            <Text style={styles.titlePhotoName} lineBreakMode='tail' numberOfLines={1}>{itemShow.photoType}</Text>
            <Text style={styles.titlePhotoTime}>{formatDateTimeVN(itemShow.photoFullTime, 'HH:mm:ss')}</Text>
            {/* // Image Status */}
            {itemShow.isRemove && <View style={styles.opacityView} />}
            {itemShow.isRemove &&
                <View style={styles.iconRemoveView}>
                    <Icon type={appConfig.ICON_TYPE} name="checkmark-circle-outline" size={24} color={appColors.errorColor} />
                </View>
            }
        </TouchableOpacity>
    );
};

export default ItemImageReport;