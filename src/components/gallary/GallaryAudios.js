import React, { useCallback, useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { AUDIO_CONTROLLER } from "../../controllers/AudioController";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomListView from "../lists/CustomListView";
import ButtonConfirm from "../button/ButtonConfirm";
import { Icon, Text } from "@rneui/themed";
import appConfig from "../../utils/appConfig/appConfig";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { isValidData } from "../../utils/validateData";
import RNFS from 'react-native-fs';
import { downloadAudioFile } from "../../utils/helper";
import _ from 'lodash';

const GallaryAudios = ({ data = [], shopInfo, onShowByData }) => {
    const { appColors } = useTheme()
    const [dataMain, setDataMain] = useState([])
    const [dataAudio, setDataAudio] = useState([])
    const [audioSelect, _setAudioSelect] = useState({ openSelect: false, countData: 0, lstSelect: [] })
    const [_mutate, setMutate] = useState(false)
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer())
    //
    const LoadData = async () => {
        if (isValidData(data)) {
            const _audioList = _.map(data, (e) => {
                if (e.photoPath.startsWith('/uploaded/'))
                    return { ...e, audioPath: `${appConfig.URL_ROOT}${e.photoPath}` }
                return e
            })
            onShowByData && onShowByData(isValidData(_audioList))
            setDataMain(_audioList)
            setDataAudio(_audioList)
        } else {
            await AUDIO_CONTROLLER.GetDataGallaryAudio(shopInfo.shopId, (mData) => {
                onShowByData && onShowByData(isValidData(mData))
                setDataMain(mData)
                setDataAudio(mData)
            })
        }
    }
    // Handler 
    const handlerDelete = async () => {
        await AUDIO_CONTROLLER.DeleteDataAudio(audioSelect.lstSelect, () => {
            audioSelect.lstSelect = []
            audioSelect.countData = 0
            audioSelect.openSelect = false
            LoadData()
        })
    }
    const handlerCancel = () => {
        audioSelect.lstSelect = []
        audioSelect.countData = 0
        audioSelect.openSelect = false
        // 
        const updateSelect = _.map(dataMain, (e) => { return { ...e, isSelect: false } })
        setDataMain(updateSelect)
        setDataAudio(updateSelect)
    }
    const onSelectAudio = (item) => {
        const value = !(item.isSelect || false)
        item.isSelect = value
        audioSelect.countData = audioSelect.countData + (value ? 1 : -1)
        audioSelect.openSelect = true
        //
        if (value)
            audioSelect.lstSelect.push(item)
        else
            _.pullAll(audioSelect.lstSelect, [item])
        //
        if (audioSelect.lstSelect == null || audioSelect.lstSelect.length == 0)
            audioSelect.openSelect = false
        setMutate(e => !e)
    }
    // Audio 
    const handlerPlayAudio = (item) => {
        const value = !(item.isPlaying || false)
        item.isPlaying = value
        setMutate(e => !e)
        //
        if (value)
            onPlayAudio(item)
        else
            onStopPlay(item)
    }
    const onPlayAudio = useCallback(async (item) => {
        await audioRecorderPlayer.current.setSubscriptionDuration(0.1)
        await audioRecorderPlayer.current.startPlayer(item.audioPath);
        await audioRecorderPlayer.current.setVolume(1.0);
        await audioRecorderPlayer.current.addPlayBackListener(async e => {
            const _time = audioRecorderPlayer.current.mmssss(Math.floor(e.currentPosition))
            const _timeDefault = audioRecorderPlayer.current.mmssss(Math.floor(e.duration))
            if (_time == _timeDefault) {
                onStopPlay(item)
            } else {
                item.playTime = _time
                setMutate(e => !e)
            }
        });
    }, [])
    const onStopPlay = useCallback(async (item) => {
        await audioRecorderPlayer.current.stopPlayer();
        await audioRecorderPlayer.current.removePlayBackListener();
        item.playTime = item.fileTime
        item.isPlaying = false
        setMutate(e => !e)
    }, [])
    const handlerDownload = async () => {
        if (isValidData(audioSelect.lstSelect)) {
            const downloadDir = Platform.OS === 'android' ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
            await downloadAudioFile(downloadDir, audioSelect.lstSelect, 'AUDIO', handlerCancel)
        }
    };
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.whiteColor },
        itemMain: { width: '100%', backgroundColor: appColors.backgroundColor, marginVertical: 8 },
        contentAudio: { borderRadius: 8, overflow: 'hidden', zIndex: 1, marginHorizontal: 4, alignItems: 'center', backgroundColor: appColors.cardColor },
        iconSelect: { position: 'absolute', top: 0, end: 0, zIndex: 1000, padding: 8 },
        titleAudioTime: { fontSize: 12, fontWeight: '500', color: appColors.textColor },
        opacityView: { width: '100%', height: '100%', backgroundColor: appColors.opacityColor, opacity: 0.6, zIndex: 1000, position: 'absolute' },
        statusView: { width: 12, height: 12, borderRadius: 10, backgroundColor: appColors.errorColor, position: 'absolute', top: 3, end: 3, borderWidth: 1, borderColor: appColors.lightColor },
    })
    const renderItem = ({ item, index }) => {
        const onAudioPress = () => {
            audioSelect.openSelect ? onSelectAudio(item) : handlerPlayAudio(item)
        }
        const onLongPress = () => {
            onSelectAudio(item)
        }
        const iconAudio = item.isPlaying ? 'stop' : 'play'
        const colorAudio = item.isPlaying ? appColors.errorColor : appColors.textColor
        const statusColor = item.fileUpload == 1 ? appColors.successColor : appColors.errorColor
        return (
            <View key={index} style={styles.itemMain}>
                <TouchableOpacity style={styles.contentAudio} onPress={onAudioPress} onLongPress={onLongPress}>
                    <View style={{ padding: 8 }}>
                        <Icon type={appConfig.ICON_TYPE} name={iconAudio} color={colorAudio} />
                        <Text style={styles.titleAudioTime}>{item.playTime || item.fileTime || '00:00:00'}</Text>
                    </View>
                    <View style={{ ...styles.statusView, backgroundColor: statusColor }} />
                    {item.isSelect && <View style={styles.opacityView} />}
                    {item.isSelect &&
                        <View style={styles.iconSelect}>
                            <Icon type={appConfig.ICON_TYPE} name="checkmark-circle" size={24} color={appColors.errorColor} />
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                data={dataAudio}
                extraData={dataAudio}
                numColumns={4}
                renderItem={renderItem}
            />
            <ButtonConfirm
                isVisible={audioSelect.openSelect}
                content={`Đã chọn ${audioSelect.countData} file ghi âm`}
                onDelete={handlerDelete}
                onCannel={handlerCancel}
                onDownload={handlerDownload}
            />
        </View>
    )
}

export default GallaryAudios;