import React, { useEffect, useState, useCallback } from "react";
import useTheme from "../../hooks/useTheme";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { PHOTO_CONTROLLER } from "../../controllers/PhotoController";
import GroupData from "../GroupData";
import CustomListView from "../lists/CustomListView";
import { Icon, Image } from "@rneui/themed";
import { deviceHeight } from "../../styles/styles";
import appConfig from "../../utils/appConfig/appConfig";
import ButtonConfirm from "../button/ButtonConfirm";
import ViewPictures from "./ViewPictures";
import { isValidData } from "../../utils/validateData";
import _ from 'lodash';
import FastImage from "react-native-fast-image";
import { downloadImage } from "../../utils/helper";

const GallaryPhotos = ({ data = [], shopInfo, menuReportInfo = {} }) => {
    const { appColors } = useTheme()
    const [dataMain, setDataMain] = useState([])
    const [dataPhoto, setDataPhoto] = useState([])
    const [pictureShow, _setPictureShow] = useState({ visible: false, index: 0 })
    const [pictureRemove, _setPictureRemove] = useState({ openRemove: false, countData: 0, lstRemove: [] })
    const [_mutate, setMutate] = useState(false)
    //
    const LoadData = useCallback(async () => {
        if (isValidData(data)) {
            const _photoList = _.map(data, (e) => {
                if (e.photoPath.startsWith('/uploaded/'))
                    return { ...e, photoPath: `${appConfig.URL_ROOT}${e.photoPath}`, url: `${appConfig.URL_ROOT}${e.photoPath}` }
                return e
            })
            setDataMain(_photoList)
            setDataPhoto(_photoList)
        } else {
            await PHOTO_CONTROLLER.GetDataPhoto(shopInfo.shopId, (menuReportInfo?.id || 0), shopInfo.auditDate, (mData) => {
                setDataMain(mData)
                setDataPhoto(mData)
            })
        }
    }, [data, menuReportInfo, shopInfo])

    // Handler
    const handlerChangeGroup = useCallback((item, keyValue, isMultiple) => {
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const imageData = _.filter(listChooseGroup, (e) => e.isChooseTag == 1)
        //
        setDataMain(listChooseGroup)
        setDataPhoto(imageData !== null && imageData.length > 0 ? imageData : listChooseGroup)
    }, [dataMain])

    const handlerDelete = useCallback(async () => {
        await PHOTO_CONTROLLER.DeleteDataPhoto(pictureRemove.lstRemove, () => {
            pictureRemove.lstRemove = []
            pictureRemove.countData = 0
            pictureRemove.openRemove = false
            LoadData()
        })
    }, [LoadData, pictureRemove])

    const handlerCancel = useCallback(() => {
        pictureRemove.lstRemove = []
        pictureRemove.countData = 0
        pictureRemove.openRemove = false
        //
        const updateData = _.map(dataMain, (e) => { return { ...e, isRemove: false } })
        const imageData = _.filter(dataMain, (e) => e.isChooseTag == 1)
        setDataMain(updateData)
        setDataPhoto(imageData !== null && imageData.length > 0 ? imageData : updateData)
    }, [dataMain, pictureRemove])

    const onShowPicture = useCallback((index) => {
        pictureShow.visible = true
        pictureShow.index = index
        setMutate(e => !e)
    }, [pictureShow])

    const onHidePicture = useCallback(() => {
        pictureShow.visible = false
        pictureShow.index = 0
        setMutate(e => !e)
    }, [pictureShow])

    const onDeletePicture = useCallback((item) => {
        const value = !(item.isRemove || false)
        item.isRemove = value
        pictureRemove.countData = pictureRemove.countData + (value ? 1 : -1)
        pictureRemove.openRemove = true
        //
        if (value)
            pictureRemove.lstRemove.push(item)
        else
            _.pullAll(pictureRemove.lstRemove, [item])
        //
        if (pictureRemove.lstRemove == null || pictureRemove.lstRemove.length == 0)
            pictureRemove.openRemove = false
        setMutate(e => !e)
    }, [pictureRemove])

    const handlerDownloadFile = useCallback(async () => {
        if (isValidData(pictureRemove.lstRemove)) {
            await downloadImage(pictureRemove.lstRemove, handlerCancel);
        }
    }, [pictureRemove, handlerCancel]);

    //
    useEffect(() => {
        LoadData()
    }, [LoadData])

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        itemMain: { width: '100%', backgroundColor: appColors.backgroundColor, marginBottom: 8 },
        contentImage: { borderRadius: 8, overflow: 'hidden', zIndex: 1, marginHorizontal: 8 },
        opacityView: { width: '100%', height: '100%', backgroundColor: appColors.opacityColor, opacity: 0.6, zIndex: 1000, position: 'absolute' },
        iconRemoveView: { position: 'absolute', top: 0, end: 0, zIndex: 1, padding: 8 },
        imageStyle: { width: '100%', height: deviceHeight / 5, zIndex: 1 }
    })

    const renderItem = useCallback(({ item, index }) => {
        const onImagePress = () => {
            pictureRemove.openRemove ? onDeletePicture(item) : onShowPicture(index)
        }
        const onDeleteImage = () => {
            onDeletePicture(item)
        }

        return (
            <View key={index} style={styles.itemMain}>
                <TouchableOpacity style={styles.contentImage} onPress={onImagePress} onLongPress={onDeleteImage}>
                    <FastImage
                        source={{ uri: item.photoPath, priority: 'low' }}
                        style={styles.imageStyle}
                        resizeMode="cover"
                        resizeMethod="resize"
                    />
                    {item.isRemove && <View style={styles.opacityView} />}
                    {item.isRemove &&
                        <View style={styles.iconRemoveView}>
                            <Icon type={appConfig.ICON_TYPE} name="checkmark-circle-outline" size={24} color={appColors.errorColor} />
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }, [onShowPicture, onDeletePicture, pictureRemove, appColors, styles])
    return (
        <View style={styles.mainContainer}>
            <GroupData
                dataMain={dataMain}
                keyName='photoType'
                keyValue='photoType'
                handlerChange={handlerChangeGroup}
            />
            <CustomListView
                data={dataPhoto}
                extraData={dataPhoto}
                renderItem={renderItem}
            />
            <ButtonConfirm
                isVisible={pictureRemove.openRemove}
                content={`Đã chọn ${pictureRemove.countData} tấm hình`}
                onDelete={handlerDelete}
                onCannel={handlerCancel}
                onDownload={handlerDownloadFile}
            />
            <ViewPictures
                visible={pictureShow.visible}
                images={dataPhoto}
                initialIndex={pictureShow.index}
                onSwipeDown={onHidePicture}
            />
        </View>
    )
}
export default GallaryPhotos;
