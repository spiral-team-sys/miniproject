import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import useTheme from "../../hooks/useTheme";
import RNFS from 'react-native-fs';
import { Text } from "@rneui/themed";
import { fontWeightBold } from "../../utils/utility";
import { deviceWidth } from "../../styles/styles";
import { isValidData } from "../../utils/validateData";

const ViewPictures = ({ visible = false, images = [], initialIndex = 0, onSwipeDown }) => {
    const { appColors } = useTheme()
    //
    const handlerSave = async (url) => {
        try {
            if (!url.startsWith('file://')) {
                console.log("Invalid local file URL.");
                return;
            }
            const PictureDir = RNFS.PicturesDirectoryPath;
            const fileName = url.split('/').pop();
            const targetPath = `${PictureDir}/${fileName}`;
            const localPath = url.startsWith('file://') ? url.replace('file://', '') : url;
            await RNFS.copyFile(localPath, targetPath);
        } catch (error) {
            console.log("Error saving image:", error);
        }
    }
    //
    const styles = StyleSheet.create({
        countContainer: { position: 'absolute', bottom: deviceWidth / 10, left: 0, right: 0, alignItems: 'center', zIndex: 10, },
        countText: { color: appColors.whiteColor, fontSize: 15, fontWeight: fontWeightBold, letterSpacing: 1 },
        typeText: { color: appColors.whiteColor, fontSize: 12, fontWeight: '500', padding: 8 },
    })
    const renderIndicator = (currentIndex, allSize) => {
        const indexPhoto = currentIndex > 0 ? currentIndex - 1 : currentIndex
        const photoType = images[indexPhoto].photoType
        return (
            <View style={styles.countContainer}>
                {isValidData(images) && photoType && <Text style={styles.typeText}>{photoType}</Text>}
                <Text style={styles.countText}>{`${currentIndex}/${allSize}`}</Text>
            </View>
        )
    }
    if (!isValidData(images)) return <View />
    return (
        <Modal visible={visible} transparent onRequestClose={onSwipeDown}>
            <ImageViewer
                imageUrls={images}
                index={initialIndex}
                onSwipeDown={onSwipeDown || null}
                enableSwipeDown={onSwipeDown}
                renderIndicator={renderIndicator}
                onSave={handlerSave}
            />
        </Modal>
    )
}

export default ViewPictures;