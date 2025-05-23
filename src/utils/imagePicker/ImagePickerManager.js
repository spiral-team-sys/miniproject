import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { toastError, toastInfo } from '../configToast';
import { CAMERA_PERMISSION, checkAndRequestPermission } from '../permissions';
import { imageSize } from '../utility';
import { resizeImage } from '../helper';
import RNFS from 'react-native-fs'
const options = {
    mediaType: 'photo',
    saveToPhotos: false,
    quality: 0.6,
    maxWidth: imageSize.width,
    maxHeight: imageSize.height
};
//
const capturePhoto = async (callback) => {
    try {
        const hasPermission = await checkAndRequestPermission(CAMERA_PERMISSION);
        if (!hasPermission) {
            return toastError('Lỗi quyền truy cập', 'Không có quyền truy cập máy ảnh.');
        }

        // Mở camera và xử lý kết quả
        const response = await new Promise((resolve) => launchCamera(options, resolve));
        if (response.errorCode) {
            toastError('Lỗi máy ảnh', response.errorMessage || response.errorCode);
            return callback();
        }

        if (!response.assets || response.assets.length === 0) {
            return callback();
        }

        const itemAsset = response.assets[0];
        try {
            // Thay đổi kích thước ảnh
            const resizedUri = await resizeImage(itemAsset.uri);
            if (resizedUri) {
                await RNFS.unlink(itemAsset.uri);
                callback([{ ...itemAsset, uri: resizedUri }]);
            } else {
                throw new Error('Resize thất bại');
            }
        } catch (resizeError) {
            console.error(resizeError);
            toastError('Lỗi', 'Không thể thay đổi kích thước ảnh.');
        }
    } catch (error) {
        console.error(error);
        toastInfo('Máy ảnh không hoạt động', 'Máy ảnh trên thiết bị của bạn đang gặp vấn đề, vui lòng kiểm tra lại.');
    }
};
const captureMultiplePhoto = async (callback, maxPhotos = 1) => {
    try {
        const capturedPhotos = [];
        let photoCount = 0;

        const captureImage = async () => {
            return new Promise((resolve, reject) => {
                launchCamera({ mediaType: 'photo' }, (response) => {
                    if (response.didCancel) {
                        resolve(null);
                    } else if (response.errorCode) {
                        reject(response.errorMessage);
                    } else {
                        resolve(response.assets ? response.assets[0] : null);
                    }
                });
            });
        };

        while (photoCount < maxPhotos) {
            const photo = await captureImage().catch((error) => {
                console.warn('Camera error:', error);
                toastInfo('Thông báo', 'Không thể lưu ảnh, vui lòng thử lại.');
                return null;
            });

            if (!photo) {
                break; // Thoát nếu người dùng hủy
            }

            const resizedPhoto = await resizeImage(photo.uri).catch((resizeError) => {
                console.warn('Resize error:', resizeError);
                toastInfo('Thông báo', 'Không thể xử lý ảnh, vui lòng thử lại.');
                return null;
            });

            if (resizedPhoto) {
                try {
                    await RNFS.unlink(photo.uri);
                    capturedPhotos.push({ ...photo, uri: resizedPhoto });
                    photoCount++;
                } catch (unlinkError) {
                    console.warn('File deletion error:', unlinkError);
                }
            } else {
                capturedPhotos.push(photo);
                photoCount++;
            }
        }

        callback(capturedPhotos);
    } catch (error) {
        console.error('Unexpected error:', error);
        toastInfo(
            'Máy ảnh không hoạt động',
            'Máy ảnh trên thiết bị của bạn đang gặp vấn đề, vui lòng kiểm tra lại.'
        );
    }
};
const choosePhotoFromLibrary = (callback) => {
    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else {
            callback(response.assets[0]);
        }
    });
};
//
export const ImagePickerManager = { capturePhoto, choosePhotoFromLibrary, captureMultiplePhoto }