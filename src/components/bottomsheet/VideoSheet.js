import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/themed';
import Video from 'react-native-video';
import _ from 'lodash'
import Slider from '@react-native-community/slider';
import useTheme from '../../hooks/useTheme';
import { deviceWidth } from '../../styles/styles';
import Loading from '../Loading';
import appConfig from '../../utils/appConfig/appConfig';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { KEYs } from '../../utils/storageKeys';

const VideoSheet = ({ onBeforeShow, url }) => {
    const { appColors } = useTheme()
    const refVideo = useRef(null);
    const [loading, setLoading] = useState(false);
    const [paused, setPaused] = useState(true);
    const [_mutate, setMutate] = useState(false)
    const [time, _setTime] = useState({ minutes: 0, seconds: 0, duration: 0 })
    // 
    const onBuffer = (e) => {
        console.log(e)
    }
    const onError = (error) => {
        toastError("Lỗi truy xuất video", error)
    }
    const onProgress = (data) => {
        time.duration = Math.floor(data.seekableDuration)
        time.seconds = Math.floor((data.currentTime) % 60)
        time.minutes = Math.floor((data.currentTime) / 60)
        setMutate(e => !e)
    }
    const onLoad = (data) => {
        setLoading(true)
        time.seconds = 0;
        time.minutes = 0;
        time.duration = Math.floor(data.duration)
        setMutate(e => !e)
        setLoading(false)
    };
    const onEnd = () => {
        refVideo.current.seek(time.duration)
        setPaused(true)
    }
    const onChangeValueSlider = (valueSlider) => {
        const slideValue = valueSlider == time.duration ? time.duration : Math.floor(valueSlider)
        refVideo.current.seek(slideValue)
        setMutate(e => !e)
    }
    const handlerPlay = () => {
        const totalTime = time.minutes * 60 + time.seconds
        if (totalTime >= time.duration) {
            refVideo.current.seek(0)
            setPaused(false)
        } else {
            setPaused(!paused)
        }
    }
    const onClose = () => {
        SheetManager.hide(KEYs.ACTION_SHEET.VIDEO_SHEET)
    }
    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        if (minutes === 0) {
            return `00:${seconds < 10 ? '0' + seconds : seconds}`;
        }
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };
    // 
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        return () => { isMounted = false }
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.lightColor },
        containerPlayPosition: { position: 'absolute', bottom: 20, alignItems: 'center', width: deviceWidth, padding: 20 },
        containerPlay: { backgroundColor: appColors.darkColor, width: '100%', height: '100%', borderRadius: 12 },
        containerTime: { width: '100%', height: 5, borderRadius: 3, height: 40, alignItems: 'center', flexDirection: 'row' },
        timeStart: { width: '15%', justifyContent: 'center', alignItems: 'center' },
        slider: { height: 5, borderRadius: 3, width: `70%`, justifyContent: 'center' },
        totalTime: { width: '15%', justifyContent: 'center', alignItems: 'center' },
        playButton: { height: 50, justifyContent: "center", alignItems: 'center', flexDirection: 'row', width: '100%' },
        textTime: { color: appColors.lightColor, fontSize: 14, },
        closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 100 },
        buttonVideo: { width: '30%' },
        video: { height: '100%', width: '100%' }
    })

    if (loading) return <Loading isLoading={loading} />
    return (
        <ActionSheet style={styles.mainContainer} id={KEYs.ACTION_SHEET.VIDEO_SHEET} onBeforeShow={onBeforeShow}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" raised size={13} type={appConfig.ICON_TYPE} />
            </TouchableOpacity>
            <Video
                source={{ uri: url }}
                ref={refVideo}
                resizeMode='contain'
                pictureInPicture={true}
                fullscreenOrientation="landscape"
                style={styles.video}
                onVideoBuffer={onBuffer}
                onVideoError={onError}
                onEnd={onEnd}
                onProgress={onProgress}
                onLoad={onLoad}
                paused={paused}
                onTouchEnd={handlerPlay}
            />
            <View style={styles.containerPlayPosition}>
                <View style={styles.containerPlay}>
                    <View style={styles.containerTime}>
                        <View style={styles.timeStart}>
                            <Text style={styles.textTime}>
                                {`${time.minutes < 10 ? '0' + time.minutes : time.minutes}:${time.seconds < 10 ? '0' + time.seconds : time.seconds}`}
                            </Text>
                        </View>
                        <View style={styles.slider}>
                            <Slider
                                value={(time.minutes * 60) + time.seconds || 0}
                                maximumValue={time.duration || 0}
                                minimumValue={0}
                                step={1}
                                onSlidingComplete={onChangeValueSlider}
                                minimumTrackTintColor={appColors.primary}
                                maximumTrackTintColor={appColors.surface}
                                thumbTintColor={appColors.primary}
                            />
                        </View>
                        <View style={styles.totalTime}>
                            <Text style={styles.textTime}>
                                {`${formatDuration(time.duration)}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.playButton}>
                        <TouchableOpacity onPress={() => handlerPlay()} style={styles.buttonVideo}>
                            <Icon name={paused ? 'play' : 'pause'} size={30} color="#fff" type='font-awesome-5' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ActionSheet>
    )
}
export default VideoSheet