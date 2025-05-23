import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices, useCameraFormat } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { Icon, Text } from '@rneui/themed';
import { toastError, toastInfo } from '../../utils/configToast';
import { imageSize } from '../../utils/utility';
import { resizeImage } from '../../utils/helper';
import appConfig from '../../utils/appConfig/appConfig';
import useTheme from '../../hooks/useTheme';
import Loading from '../Loading';
import RNFS from 'react-native-fs';

const CameraAction = forwardRef((props, _ref) => {
    const { isResetCamera, onPreview, onClose, cameraConfig } = props;
    const { appColors } = useTheme();
    const isFocused = useIsFocused();
    const [waitingPhoto, setWaitingPhoto] = useState(false);
    const cameraRef = useRef(null);
    const devices = useCameraDevices();
    const frontCameraId = devices.findIndex(device => device.position === 'front');
    const backCameraId = devices.findIndex(device => device.position === 'back');
    const [cameraPosition, setCameraPosition] = useState(frontCameraId !== -1 ? frontCameraId : backCameraId);
    const [flash, setFlash] = useState('off');
    const device = devices[cameraPosition];
    const format = useCameraFormat(device, [{ photoResolution: { width: imageSize.width, height: imageSize.height } }]);
    const [count, setCount] = useState(0)
    //
    const onCameraError = useCallback((error) => { console.log(`Máy ảnh gặp lỗi. Vui lòng kiểm tra thiết bị. ${error}`) }, []);
    //
    const handlerCapture = async () => {
        await setWaitingPhoto(true);
        if (cameraConfig.isAutoCapture) {
            let countdown = cameraConfig.autoCaptureTime
            const interval = setInterval(async () => {
                setCount(countdown)
                if (countdown == 0) {
                    takePhoto()
                    clearInterval(interval)
                }
                countdown -= 1
            }, 1000);
        } else {
            takePhoto();
        }
    };
    const takePhoto = async () => {
        try {
            if (!cameraRef.current || !device) {
                toastInfo('Thông báo', 'Máy ảnh không hoạt động, vui lòng kiểm tra thiết bị.');
                setWaitingPhoto(false);
                return;
            }

            const photo = await cameraRef.current.takePhoto({
                photoCodec: 'jpeg',
                qualityPrioritization: 'speed',
                format: format,
            });

            const imageResult = await resizeImage(photo.path);
            if (imageResult) {
                await RNFS.unlink(photo.path);
                cameraRef.current.pausePreview?.();
                onPreview(imageResult);
            } else {
                toastError('Thông báo', 'Lỗi tạo hình ảnh trên thiết bị. Vui lòng thử lại.');
            }
        } catch (error) {
            console.log(error);
            toastInfo('Thông báo', 'Không thể chụp ảnh. Vui lòng thử lại.');
        } finally {
            setWaitingPhoto(false);
        }
    };
    const toggleCamera = async () => {
        const positionValue = cameraPosition == backCameraId ? frontCameraId : backCameraId;
        if (positionValue == frontCameraId) setFlash('off');
        setCameraPosition(positionValue);
    };
    const toggleFlash = () => {
        if (device?.hasTorch) {
            setFlash(prev => (prev === 'off' ? 'on' : 'off'));
        } else {
            toastInfo('Thông báo', 'Máy ảnh không hỗ trợ đèn flash.');
        }
    };
    //
    useEffect(() => {
        let countdown = 0;
        const interval = setInterval(() => {
            if (device || countdown >= 10) {
                clearInterval(interval);
                if (!device) {
                    onClose && onClose('Máy ảnh không khởi động. Vui lòng kiểm tra thiết bị.');
                }
            }
            countdown += 1;
        }, 1000);
        return () => clearInterval(interval);
    }, [device, onClose]);

    useEffect(() => {
        if (isResetCamera && cameraRef.current) {
            cameraRef.current.stopRecording?.();
            cameraRef.current = null;
        }

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stopRecording?.();
                cameraRef.current = null;
            }
        };
    }, [isResetCamera, isFocused]);
    //
    const styles = StyleSheet.create({
        cameraContainer: { flex: 1 },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.backgroundColor },
        waitingView: { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' },
        actionButtonMain: { width: '100%', flexDirection: 'row', position: 'absolute', bottom: 38, alignItems: 'center', justifyContent: 'center' },
        actionButtonItem: { width: '33%', alignItems: 'center' },
        actionCapture: { borderWidth: 3, borderRadius: 54, borderColor: appColors.whiteColor, alignSelf: 'center' },
        actionFlash: { padding: 8, borderRadius: 32 },
        actionChangeCamera: { padding: 8, borderRadius: 32 },
        opacityView: { backgroundColor: appColors.darkColor, opacity: 0.4, position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, justifyContent: 'center', alignItems: 'center', borderRadius: 50 },
        textCount: { fontSize: 120, color: appColors.whiteColor },
        countdown: { position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, bottom: 0, left: 0, right: 0 }
    });

    if (!device)
        return (
            <View style={styles.loadingContainer}>
                <Loading isLoading={true} color={appColors.textColor} message='Đang khởi động máy ảnh' />
            </View>
        )

    return (
        <View style={styles.cameraContainer}>
            {isFocused && (
                <Camera
                    ref={cameraRef}
                    isActive={isFocused}
                    device={device}
                    torch={flash}
                    photo={true}
                    audio={false}
                    video={false}
                    style={StyleSheet.absoluteFill}
                    onError={onCameraError}
                />
            )}
            {count > 0 &&
                <View style={styles.countdown}>
                    <Text style={styles.textCount}>{count}</Text>
                </View>
            }
            <View style={styles.actionButtonMain}>
                <View style={styles.actionButtonItem}>
                    {cameraConfig.changeCameraId &&
                        <TouchableOpacity style={styles.actionChangeCamera} disabled={waitingPhoto} onPress={toggleCamera}>
                            <View style={styles.opacityView} />
                            <Icon type={appConfig.ICON_TYPE} name='sync' color={appColors.whiteColor} size={32} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.actionButtonItem}>
                    <TouchableOpacity style={styles.actionCapture} disabled={waitingPhoto} onPress={handlerCapture}>
                        <View style={styles.opacityView} />
                        <Icon type={appConfig.ICON_TYPE} name='ellipse' color={appColors.whiteColor} size={54} />
                        {waitingPhoto && <ActivityIndicator size='small' color={appColors.disabledColor} style={styles.waitingView} />}
                    </TouchableOpacity>
                </View>
                <View style={styles.actionButtonItem}>
                    {cameraPosition === backCameraId && device?.hasTorch &&
                        <TouchableOpacity style={styles.actionFlash} disabled={waitingPhoto} onPress={toggleFlash}>
                            <View style={styles.opacityView} />
                            <Icon type={appConfig.ICON_TYPE} name={flash === 'on' ? 'flash' : 'flash-off'} color={appColors.whiteColor} size={32} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    );
});

export default CameraAction;
