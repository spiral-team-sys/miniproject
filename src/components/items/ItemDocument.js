import React, { useEffect, useState } from 'react';
import useTheme from '../../hooks/useTheme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontWeightBold } from '../../utils/utility';
import moment from 'moment';
import CachedImage from '../images/CachedImage';
import { cleanURL, processImagePath } from '../../utils/helper';
import { Icon } from '@rneui/themed';
import appConfig from '../../utils/appConfig/appConfig';
import { SheetManager } from 'react-native-actions-sheet';
import DocumentSheet from '../bottomsheet/DocumentSheet';
import VideoSheet from '../bottomsheet/VideoSheet';

const ItemDocument = ({ item, index, refCode }) => {
    const { appColors } = useTheme()
    const [url, setUrl] = useState(null)

    useEffect(() => { }, [item])

    const onPress = () => {
        const fileUrl = `${appConfig.URL_ROOT}${item.FilePath}${item.FileExtension}`;
        if (refCode === 'Video') {
            SheetManager.show('videoSheet', { payload: { data: cleanURL(fileUrl) } })
        } else {
            const isDocument = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"].includes(item.FileExtension);
            const isMedia = [".png", ".jpeg", ".jpg", ".webp", ".mp4", ".mp3"].includes(item.FileExtension);
            if (isDocument) {
                SheetManager.show('documentSheet', { payload: { data: cleanURL(`https://docs.google.com/gview?embedded=true&url=${fileUrl}`) } })
            } else if (isMedia) {
                SheetManager.show('documentSheet', { payload: { data: cleanURL(fileUrl) } })
            } else {
                toastError("Chưa hỗ trợ", "Chưa có định dạng hỗ trợ xem file");
            }
        }
    }

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        nameDoc: { color: appColors.darkColor, fontSize: 15, fontWeight: fontWeightBold },
        desDoc: { color: appColors.darkColor, fontSize: 13, fontStyle: 'italic', opacity: 0.8 },
        textButonDoc: { fontSize: 13, color: appColors.primaryColor, fontWeight: 'bold' },
        dateDoc: { fontSize: 11, color: appColors.darkColor, fontStyle: 'italic', opacity: 0.8 },
        containListDoc: { padding: 10 },
        containButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
        thumbnail: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
        mainButtonPlay: {
            position: 'absolute', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', width: 60, height: 60,
            borderRadius: 30, backgroundColor: appColors.primaryColor, transform: [{ translateX: -30 }, { translateY: -30 }]
        },
        mainContent: {
            margin: 12, shadowColor: appColors.darkColor, shadowOffset: { width: 1, height: 3 },
            shadowOpacity: 0.2, shadowRadius: 3, elevation: 5, backgroundColor: appColors.backgroundColor, borderRadius: 12
        }
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity style={styles.mainContent} onPress={onPress}>
                {refCode === 'Video' && <View>
                    <CachedImage
                        requireSource={require('../../assets/images/noimage.png')}
                        resizeMode="cover"
                        style={styles.thumbnail}
                        uri={processImagePath('thumbnail')}
                    />
                    <View style={styles.mainButtonPlay}>
                        <Icon name='play' size={32} type={appConfig.ICON_TYPE} color={appColors.lightColor} />
                    </View>
                </View>}
                <View style={styles.containListDoc}>
                    <Text style={styles.nameDoc}>{item.DocumentName}</Text>
                    <Text style={styles.desDoc}>{item.Description}</Text>
                    <View key={index} style={styles.containButton}>
                        <TouchableOpacity onPress={onPress}>
                            <Text style={styles.textButonDoc}>{`Định dạng file ${item.FileExtension}`}</Text>
                        </TouchableOpacity>
                        <Text style={styles.dateDoc}>{moment(item.createDate).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <DocumentSheet
                onBeforeShow={setUrl}
                url={url?.data}
            />
            <VideoSheet
                onBeforeShow={setUrl}
                url={url?.data}
            />
        </SafeAreaView>
    )
}
export default ItemDocument