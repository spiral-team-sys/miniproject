import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { Platform, StyleSheet, Text, View } from "react-native";
import { PHOTO_CONTROLLER } from "../../controllers/PhotoController";
import CustomListView from "../lists/CustomListView";
import { deviceHeight } from "../../styles/styles";
import ButtonConfirm from "../button/ButtonConfirm";
import ViewPictures from "./ViewPictures";
import { isValidData } from "../../utils/validateData";
import { downloadAudioFile, downloadImage, formatDateTimeVN } from "../../utils/helper";
import { FlashList } from "@shopify/flash-list";
import ItemImageReport from "../items/ItemImageReport";
import { fontWeightBold } from "../../utils/utility";
import { REPORT_API } from "../../services/reportApi";
import { ATTENDANCE_API } from "../../services/attendanceApi";
import _ from 'lodash';
import Loading from "../Loading";
import useConnect from "../../hooks/useConnect";
import { toastInfo } from "../../utils/configToast";

const GallaryPhotosGrid = ({ shopInfo, byShop = true }) => {
    const { appColors } = useTheme()
    const { isOnlyWifi, connectionType } = useConnect()
    const [dataGallary, setDataGallary] = useState([])
    const [pictureShow, _setPictureShow] = useState({ visible: false, index: 0, dataPhoto: [] })
    const [pictureRemove, _setPictureRemove] = useState({ openRemove: false, countData: 0, lstRemove: [] })
    const [isLoading, setLoading] = useState(true)
    const [_mutate, setMutate] = useState(false)
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        await PHOTO_CONTROLLER.GetDataGallaryReport({ ...shopInfo, byShop }, setDataGallary)
        await setLoading(false)
    }
    // Handler
    const handlerReUploadFiles = async () => {
        !isLoading && await setLoading(true)
        // Thiết lập gửi bằng Wifi
        if (!isOnlyWifi || (isOnlyWifi && connectionType == 'wifi')) {
            await REPORT_API.UploadFileReport(shopInfo)
        } else {
            toastInfo('Thông báo', `Đã bật thiết lập chỉ sử dụng Wifi, Nên dữ liệu hình ảnh và ghi âm sẽ chờ tới khi có wifi mới gửi lên hệ thống`)
        }
        await ATTENDANCE_API.uploadAttendancePending(shopInfo)
        await LoadData()
    }
    const handlerDelete = async () => {
        await PHOTO_CONTROLLER.DeleteDataPhoto(pictureRemove.lstRemove, () => {
            pictureRemove.lstRemove = []
            pictureRemove.countData = 0
            pictureRemove.openRemove = false
            LoadData()
        })
    }
    const handlerCancel = () => {
        pictureRemove.lstRemove = []
        pictureRemove.countData = 0
        pictureRemove.openRemove = false
        //
        const updateData = _.cloneDeep(dataGallary);
        const resetData = _.forEach(updateData, (entry) => {
            _.forEach(entry.photos, (photo) => {
                photo.isRemove = false;
            });
        });
        setDataGallary(resetData)
    }
    const handlerDownloadFile = async () => {
        if (isValidData(pictureRemove.lstRemove)) {
            if (Platform.OS === 'ios') {
                await downloadAudioFile(null, pictureRemove.lstRemove, 'PHOTO', handlerCancel)
            } else {
                await downloadImage(pictureRemove.lstRemove, handlerCancel)
            }
        }
    }
    const handlerShowImage = (index, item, photos) => {
        if (pictureRemove.openRemove) {
            onDeletePicture(item)
        } else {
            pictureShow.visible = true
            pictureShow.index = index
            pictureShow.dataPhoto = photos
            setMutate(e => !e)
        }
    }
    const onHidePicture = () => {
        pictureShow.visible = false
        pictureShow.index = 0
        setMutate(e => !e)
    }
    const onDeletePicture = (item) => {
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
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [])

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        itemMain: { width: '100%', backgroundColor: appColors.backgroundColor, marginBottom: 8 },
        contentImage: { borderRadius: 8, overflow: 'hidden', zIndex: 1, marginHorizontal: 8 },
        opacityView: { width: '100%', height: '100%', backgroundColor: appColors.opacityColor, opacity: 0.6, zIndex: 1000, position: 'absolute' },
        iconRemoveView: { position: 'absolute', top: 0, end: 0, zIndex: 1, padding: 8 },
        imageStyle: { width: '100%', height: deviceHeight / 5, zIndex: 1 },
        titleTimeHead: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, paddingBottom: 8, paddingHorizontal: 16 },
    })

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.itemMain}>
                <Text style={styles.titleTimeHead}>{formatDateTimeVN(item.dateView, 'dddd, DD/MM YYYY')}</Text>
                <View style={styles.contentPhotos}>
                    <FlashList
                        keyExtractor={(_item, indexMain) => `photo_${indexMain}`}
                        data={item.photos}
                        extraData={[item.photos]}
                        renderItem={(photo) => {
                            return <ItemImageReport
                                item={photo.item}
                                index={photo.index}
                                photos={item.photos}
                                handlerShowImage={handlerShowImage}
                                handlerDeleteImage={onDeletePicture}
                            />
                        }}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        estimatedItemSize={50}
                        scrollEnabled={false}
                    />
                </View>
            </View>
        )
    }
    if (isLoading) return <Loading isLoading={isLoading} color={appColors.textColor} />
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                data={dataGallary}
                extraData={dataGallary}
                renderItem={renderItem}
                onRefresh={handlerReUploadFiles}
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
                images={pictureShow.dataPhoto}
                initialIndex={pictureShow.index}
                onSwipeDown={onHidePicture}
            />
        </View>
    )
}
export default GallaryPhotosGrid;
