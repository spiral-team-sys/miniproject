import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Animated, DeviceEventEmitter, Easing, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSourceAndroidType, AVEncoderAudioQualityIOSType, AVEncodingOption } from "react-native-audio-recorder-player";
import { checkAndRequestPermission, MICROPHONE_PERMISSION } from "../../utils/permissions";
import { clearAudioInfo, setAudioInfo } from "../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastError, toastSuccess } from "../../utils/configToast";
import { AUDIO_CONTROLLER } from "../../controllers/AudioController";
import { Text } from "@rneui/themed";
import LottieView from "lottie-react-native";
import useTheme from "../../hooks/useTheme";
import { KEYs } from "../../utils/storageKeys";
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import moment from "moment";
import { messageConfirm, moveFile } from "../../utils/helper";

const RecordStatus = ({ }) => {
    const { appColors } = useTheme()
    const { audioInfo } = useSelector(state => state.audio)
    const { shopInfo } = useSelector(state => state.shop)
    const [recordTime, setRecordTime] = useState('00:00:00')
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer())
    const dispatch = useDispatch()

    // Animation
    const translateX = useRef(new Animated.Value(300)).current;
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true
        }).start();
    }, []);
    //
    const LoadData = () => {
        DeviceEventEmitter.removeAllListeners(KEYs.DEVICE_EVENT.RECORD_START)
        DeviceEventEmitter.removeAllListeners(KEYs.DEVICE_EVENT.RECORD_STOP)
        //
        DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RECORD_START, handlerStartRecord)
        DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RECORD_STOP, handlerStopRecord)
    }
    // Action 
    const onStart = useCallback(async () => {
        try {
            const KEYMAP = `AUDIO_${shopInfo.shopId}_${shopInfo.auditDate}`
            const dir = RNFS.CachesDirectoryPath;
            const audioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
            };
            const fileName = uuid.v4();
            await AsyncStorage.setItem(KEYMAP, fileName);
            const pathAudio = Platform.select({
                ios: `${fileName}.m4a`,
                android: `${dir}/${fileName}.mp3`
            });
            await audioRecorderPlayer.current.setSubscriptionDuration(0.1);
            await audioRecorderPlayer.current.startRecorder(pathAudio, audioSet);
            await audioRecorderPlayer.current.addRecordBackListener(async (e) => {
                const recordTime = audioRecorderPlayer.current.mmssss(Math.floor(e.currentPosition));
                await setRecordTime(recordTime);
            });
        } catch (e) {
            toastError('Lỗi ghi âm', `START_AUDIO: ${e}`);
        }
    });
    const onStop = useCallback(async () => {
        try {
            const KEYMAP = `AUDIO_${shopInfo.shopId}_${shopInfo.auditDate}`
            let filePathResult = await audioRecorderPlayer.current.stopRecorder()
            await audioRecorderPlayer.current.removeRecordBackListener()
            if (filePathResult !== 'Already stopped') {
                const filePath = await moveFile(filePathResult)
                const UUID = await AsyncStorage.getItem(KEYMAP);
                const itemAudio = {
                    shopId: shopInfo.shopId,
                    audioDate: shopInfo.auditDate,
                    audioTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    reportId: -1,
                    fileTime: recordTime,
                    fileName: filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length),
                    audioPath: filePath,
                    guid: UUID,
                    dataUpload: 0,
                    fileUpload: 0
                }
                await AUDIO_CONTROLLER.InsertDataAudio(itemAudio)
                await toastSuccess('Ghi âm', 'Đã lưu file ghi âm')
                await AsyncStorage.removeItem(KEYMAP)
                await setRecordTime('00:00:00')
            } else {
                toastError('Lỗi ghi âm', 'Đang khởi động trình ghi âm vui lòng chờ trong ít phút')
            }
        } catch (e) {
            toastError('Lỗi ghi âm', `STOP_AUDIO: ${e}`)
        }
    })
    const onCancel = useCallback(async () => {
        try {
            const KEYMAP = `AUDIO_${shopInfo.shopId}_${shopInfo.auditDate}`
            await audioRecorderPlayer.current.stopRecorder()
            await audioRecorderPlayer.current.removeRecordBackListener()
            await AsyncStorage.removeItem(KEYMAP)
            await setRecordTime('00:00:00')
            await dispatch(clearAudioInfo())
        } catch (e) {
            toastError('Lỗi ghi âm', `CANCEL_AUDIO: ${e}`)
        }
    })
    // Handler
    const handlerStartRecord = async (info) => {
        const permission_status = await checkAndRequestPermission(MICROPHONE_PERMISSION)
        if (permission_status) {
            await dispatch(setAudioInfo(info))
            await onStart()
        }
    }
    const handlerStopRecord = async () => {
        const options = [
            { text: "Hủy", onPress: onCancel },
            {
                text: "Đồng ý", onPress: async () => {
                    await onStop()
                    await dispatch(clearAudioInfo())
                }
            }
        ]
        messageConfirm('Ghi âm', 'Bạn có muốn lưu File ghi âm này không', options)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [shopInfo])

    // View
    const styles = StyleSheet.create({
        viewMain: { position: 'absolute', top: 1, end: 0 },
        mainContainer: {
            paddingStart: 12, paddingEnd: 8, alignSelf: 'flex-end', alignItems: 'center', flexDirection: 'row', backgroundColor: appColors.darkColor, zIndex: 10000,
            borderTopStartRadius: 50, borderBottomStartRadius: 50,
        },
        titleTimer: { fontSize: 15, color: appColors.lightColor, textAlign: 'center', fontWeight: '500', paddingHorizontal: 8 },
        viewRecord: { width: 42, height: 42, alignItems: 'center' }
    })
    if (!audioInfo?.isRecorder) return <View />
    return (
        <SafeAreaView style={styles.viewMain}>
            <Animated.View style={{ transform: [{ translateX }] }}>
                <TouchableOpacity onPress={handlerStopRecord}>
                    <View style={styles.mainContainer}>
                        <Text style={styles.titleTimer}>{recordTime || '00:00:00'}</Text>
                        <View style={styles.viewRecord}>
                            <LottieView
                                loop
                                autoPlay
                                style={{ width: '100%', height: '100%' }}
                                source={require('../../assets/lotties/recording.json')} />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    )
}

export default RecordStatus;