import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native'
import useTheme from '../../hooks/useTheme'
import { Icon } from '@rneui/themed'
import { TouchableOpacity } from 'react-native'
import appConfig from '../../utils/appConfig/appConfig'
import { PHOTO_CONTROLLER } from '../../controllers/PhotoController'
import ViewPictures from '../gallary/ViewPictures'
import CachedImage from '../images/CachedImage'
import CustomListView from '../lists/CustomListView'
import { useSelector } from 'react-redux'
import { fontWeightBold } from '../../utils/utility'
import { KEYs } from '../../utils/storageKeys'
import _ from 'lodash'

const ItemCapturePhotos = ({ navigation, item, uploaded, menuReportInfo }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [dataPhoto, setDataPhoto] = useState([])
    const [pictureShow, _setPictureShow] = useState({ visible: false, index: 0, dataPhoto: [], photoType: '' })
    const [_mutate, setMutate] = useState(false)
    //
    const LoadData = async () => {
        await PHOTO_CONTROLLER.GetDataPhotoByType(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, item.ItemCode, setDataPhoto)
    }
    const onHidePicture = () => {
        pictureShow.visible = false
        pictureShow.index = 0
        setMutate(e => !e)
    }
    const handlerShowImage = (index, photos) => {
        pictureShow.visible = true
        pictureShow.index = index
        pictureShow.dataPhoto = photos
        pictureShow.photoType = photos.photoType
        setMutate(e => !e)
    }
    const handlerRemoveImage = (item) => {

    }
    const onTakePicture = async () => {
        const templateInfo = { ...shopInfo, reportId: menuReportInfo.id, photoType: item.ItemCode }
        navigation.navigate('CameraReport', { templateInfo })
    }
    //
    useEffect(() => {
        const reload_photo_report = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_PHOTO_REPORT, LoadData)
        LoadData()
        return () => {
            reload_photo_report.remove()
        }
    }, [item])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, padding: 8 },
        containerPhoto: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingVertical: 8, backgroundColor: appColors.cardColor, borderColor: appColors.borderColor, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
        minText: { color: item.NumPhoto < item.Min ? appColors.errorColor : appColors.textColor, textDecorationLine: item.NumPhoto < item.Min ? 'line-through' : 'none', fontSize: 11, fontStyle: 'italic' },
        containTitlePhoto: { flexDirection: 'row', alignItems: 'center' },
        titlePhoto: { fontWeight: fontWeightBold, color: appColors.textColor, fontSize: 13 },
        subTitlePhoto: { fontSize: 11, color: appColors.subTextColor, fontWeight: '500' },
        itemPhotoMain: { backgroundColor: appColors.backgroundColor, alignItems: 'center', justifyContent: 'center', marginEnd: 8, flexDirection: 'row' },
        imageContainer: { width: 90, height: 90, borderRadius: 8 },
        iconCircle: { position: 'absolute', end: 4, top: 4 },
        buttonCamera: { margin: 8, width: 65, height: 65, backgroundColor: appColors.borderColor, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
        imageView: { width: 80, height: 80 },
        viewCountPhoto: { width: 24, height: 24, borderRadius: 20, backgroundColor: appColors.errorColor, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, end: 0 },
        titleCountPhoto: { fontSize: 11, fontWeight: fontWeightBold, color: appColors.whiteColor },
        viewStatusImage: { width: 8, height: 8, borderRadius: 8, position: 'absolute', top: 4, end: 4 },
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => handlerShowImage(index, item)
        const onLongPress = () => handlerRemoveImage(item)
        return (
            <View key={index} style={styles.itemPhotoMain}>
                <CachedImage
                    uri={item.photoPath}
                    style={styles.imageContainer}
                    resizeMode="cover"
                    onPress={onPress}
                    onLongPress={onLongPress}
                />
                <View style={{ ...styles.viewStatusImage, backgroundColor: item.fileUpload == 1 ? appColors.successColor : appColors.errorColor }} />
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            {/* // Header */}
            <Text style={styles.titlePhoto}>{item.ItemName}</Text>
            <Text style={styles.subTitlePhoto}>{item.SubName || `(Chụp tối thiểu ${item.Min} tấm)`}</Text>
            {/* // Capture Photo */}
            <View style={styles.containerPhoto}>
                {!uploaded && <TouchableOpacity style={styles.buttonCamera} onPress={onTakePicture}>
                    <Icon type={appConfig.ICON_TYPE} name="camera" color={appColors.primaryColor} size={30} />
                    <View style={styles.viewCountPhoto}>
                        <Text style={styles.titleCountPhoto}>{dataPhoto.length}</Text>
                    </View>
                </TouchableOpacity>
                }
                <CustomListView
                    horizontal
                    keyExtractor={(_item, index) => index.toString()}
                    data={dataPhoto}
                    renderItem={renderItem}
                />
            </View>
            {/* // View  */}
            <ViewPictures
                visible={pictureShow.visible}
                images={dataPhoto}
                initialIndex={pictureShow.index}
                onSwipeDown={onHidePicture}
            />
        </View>
    )
}
export default ItemCapturePhotos