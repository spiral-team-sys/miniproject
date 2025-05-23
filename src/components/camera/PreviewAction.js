import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text } from '@rneui/themed';
import useTheme from '../../hooks/useTheme';
import { deviceHeight, deviceWidth } from '../../styles/styles';
import { fontWeightBold } from '../../utils/utility';
import Loading from '../Loading';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
FastImage.clearDiskCache();
FastImage.clearMemoryCache();

const PreviewAction = ({ isLoading = false, photoUri = null, onSuccess, onReject }) => {
    const { appColors } = useTheme();

    // Handler 
    const resetPicture = async () => {
        onReject()
    }
    const savePicture = async () => {
        onSuccess(photoUri)
    }
    //
    useEffect(() => {
        return () => false
    }, [photoUri])
    // View
    const styles = StyleSheet.create({
        previewContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' },
        preview: { width: deviceWidth, height: deviceHeight },
        previewButton: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 24 },
        actionPreview: { width: '35%', alignItems: 'center', padding: 16, marginHorizontal: 32 },
        titlePreviewAction: { fontSize: 16, fontWeight: fontWeightBold, color: appColors.whiteColor },
    })

    return (
        <View style={styles.previewContainer}>
            <Loading isLoading={isLoading} color={appColors.primaryColor} />
            <FastImage
                source={{ uri: `file://${photoUri}`, priority: 'low' }}
                style={styles.preview}
                resizeMode='contain'
            />
            <View style={styles.previewButton}>
                <TouchableOpacity style={styles.actionPreview} onPress={resetPicture} disabled={isLoading}>
                    <Text style={styles.titlePreviewAction}>Thử lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionPreview} onPress={savePicture} disabled={isLoading} >
                    <Text style={styles.titlePreviewAction}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default PreviewAction;
