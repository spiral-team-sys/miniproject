import { Alert, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import appConfig from "./appConfig/appConfig";
import RNFS from 'react-native-fs'
import { isValidData, isValidField } from "./validateData";
import ImageResizer from "react-native-image-resizer";
import { toastError, toastSuccess } from "./configToast";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from 'react-native-share';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PHOTO_CONTROLLER } from "../controllers/PhotoController";
import DeviceInfo from "react-native-device-info";
import { getDatabaseName, UpdateDatabase } from "../database/Database";
import _ from 'lodash';

export const removeVietnameseTones = (str) => {
    if (!str || typeof str !== 'string') return ""
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}
export const GetUseStorage = (result) => {
    RNFS.stat(RNFS.DocumentDirectoryPath)
        .then((stats) => {
            return result(stats.size)
        })
        .catch((err) => {
            console.log(err.message);
            return result(null)
        });
}
export const AppFileSize = async () => {
    try {
        const files = await PHOTO_CONTROLLER.GetALLFile()
        let totalSize = 0;
        for (const file of files) {
            const fileExists = await RNFS.exists(file.photoPath)
            if (fileExists) {
                const fileInfo = await RNFS.stat(file.photoPath);
                if (fileInfo.isFile()) {
                    totalSize += fileInfo.size; // Cộng kích thước file vào tổng
                } else {
                    console.log("Không có đọc được file")
                }
            }
        }
        // Chuyển đổi từ bytes sang MB 
        const totalSizeInMB = totalSize / (1024 * 1024);
        return { fileSize: totalSizeInMB, fileCount: files?.length || 0 };
    } catch (error) {
        console.error("Error calculating file sizes:", error);
        return null;
    }
};
export const formatNumber = (number, delimiter = ' ', bounce = 3) => {
    if (!number) return ''
    let reg = new RegExp(`[\s${delimiter}]`, "g")
    number = number.toString().replace(reg, '').split('')
    for (let i = number.length - 1, step = 0; i > -1; --i) {
        if (step === bounce) {
            number.splice(i + 1, 0, delimiter)
            step = 0
        }
        ++step
    }
    return number.join('')
}
export const groupDataByKey = ({
    arr,
    key,
    keyLayer2 = null,
    keyLayer3 = null,
    subArrKey = null,
    subKey = null,
    func = null,
    subFunc = null
}) => {
    try {
        let lastKey = null, lastKeyLayer2 = null, lastKeyLayer3 = null, lastSubKey = null;
        const anonymous = {}, subAnonymous = {};
        const processSubArray = (subArr) => {
            subArr.forEach((subItem, j) => {
                const isNewSubParent = !lastSubKey || subItem[subKey] !== lastSubKey;
                subItem.isSubParent = isNewSubParent;

                if (isNewSubParent) lastSubKey = subItem[subKey];

                if (typeof subFunc === 'function') {
                    subFunc(subItem, subAnonymous, j, subArr.length);
                }
            });
        };
        const processMainArrayItem = (item, i) => {
            const isNewParent = !lastKey || item[key] !== lastKey;
            item.isParent = isNewParent;
            if (isNewParent) {
                lastKey = item[key];
                lastKeyLayer2 = null;
                lastKeyLayer3 = null;

                if (subArrKey && Array.isArray(item[subArrKey])) {
                    processSubArray(item[subArrKey]);
                }
            }
            if (keyLayer2) {
                const layer2Key = `${item[key]}${item[keyLayer2]}`;
                const isNewLayer2 = !lastKeyLayer2 || item[keyLayer2] !== lastKeyLayer2;

                item[layer2Key] = isNewLayer2;

                if (isNewLayer2) lastKeyLayer2 = item[keyLayer2];
            }
            if (keyLayer3 && lastKeyLayer2 === item[keyLayer2]) {
                const layer3Key = `${item[key]}${item[keyLayer2]}${item[keyLayer3]}`;
                const isNewLayer3 = !lastKeyLayer3 || item[keyLayer3] !== lastKeyLayer3;

                item[layer3Key] = isNewLayer3;

                if (isNewLayer3) lastKeyLayer3 = item[keyLayer3];
            }
            if (typeof func === 'function') {
                func(item, anonymous, i, arr.length, arr);
            }
        };
        arr.forEach((item, i) => processMainArrayItem(item, i));
        return { arr, anonymous, subAnonymous };
    } catch (e) {
        return { arr: [], anonymous: {}, subAnonymous: {} };
    }
}
export const messageConfirm = (title, content, actions = []) => {
    let actionDefault = actions || [{ text: 'Đồng ý' }]
    Alert.alert(title, content, actionDefault, { cancelable: false })
}
export const alertConfirm = (title, message, finish) => {
    Alert.alert(title, message,
        [
            {
                text: 'Huỷ',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    finish();
                }
            },
        ],
        { cancelable: false },
    );
}
export const messageAlert = (title, content, onPress) => {
    Alert.alert(title, content, [{ text: 'Đồng ý', onPress }], { cancelable: false })
}
export const checkConnection = async () => {
    const { isConnected, isInternetReachable } = await NetInfo.fetch()
    return isConnected && isInternetReachable;
}
export const checkWifiConnection = async () => {
    const { isWifiEnabled } = await NetInfo.fetch()
    return isWifiEnabled
}
export const convertTimestamp = (timestamp) => {
    if (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    } else {
        return null
    }
}
export const convertDateTime = (dateTimeString) => {
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            return { success: false, error: 'Invalid datetime format' };
        }
        const timestamp = date.getTime();
        return timestamp;
    } catch (error) {
        return null;
    }
}
export const getBase64Image = async (photoPath) => {
    const base64 = await RNFS.readFile(photoPath, 'base64');
    return base64 || null
}
export const checkImageURL = async (url, local) => {
    try {
        const response = await fetch(`${appConfig.URL_ROOT}${url}`);
        if (response.status === 200) {
            return { status: true, url: `${appConfig.URL_ROOT}${url}` }
        } else {
            return { status: false, url: `file://${local}` }
        }
    } catch (e) {
        return { status: false, url: `file://${local}` }
    }
}
export const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
        /[^.]+$/.exec(filename) : undefined;
};
export const downloadImage = async (dataFiles, actionResult) => {
    try {
        const PictureDir = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.PicturesDirectoryPath;
        const date = new Date().toISOString().split('T')[0];

        const downloadPromises = dataFiles.map(async ({ url }) => {
            try {
                if (url.startsWith('https://')) {
                    // Lấy phần mở rộng file
                    const ext = '.' + getExtention(url)[0];
                    const fileName = `/image_${date}${ext}`;
                    const filePath = `${PictureDir}${fileName}`;

                    // Kiểm tra nếu file đã tồn tại
                    const fileExists = await RNFS.exists(filePath);
                    if (fileExists) {
                        console.log('File already exists:', filePath);
                        // Nếu file đã tồn tại, lưu thẳng vào thư viện
                        await CameraRoll.saveAsset(filePath, { type: 'photo', album: `EOE ${date}` });
                        return;
                    }
                    const download = await RNFS.downloadFile({
                        fromUrl: url,
                        toFile: filePath,
                        background: true,
                        discretionary: true,
                    }).promise;

                    // Kiểm tra nếu tải thành công
                    if (download.statusCode === 200) {
                        // Lưu ảnh vào thư viện
                        await CameraRoll.saveAsset(filePath, { type: 'photo', album: `EOE ${date}` });
                        console.log('Image downloaded and saved:', filePath);
                    } else {
                        console.error('Failed to download image, status:', download.statusCode);
                        throw new Error('Download failed');
                    }
                } else {
                    // Kiểm tra nếu file local đã tồn tại
                    const fileExists = await RNFS.exists(url);
                    if (fileExists) {
                        await CameraRoll.saveAsset(url, { type: 'photo', album: `EOE ${date}` });
                        console.log('Local image saved:', url);
                    } else {
                        if (url.startsWith('file://')) {
                            const filePath = url.replace('file://', '');
                            await CameraRoll.saveAsset(filePath, { type: 'photo', album: `EOE ${date}` });
                        } else {
                            console.error('Local file error')
                        }
                    }
                }
            } catch (err) {
                console.error('Error processing URL:', url, err);
            }
        });
        await Promise.all(downloadPromises);
        toastSuccess('Thông báo', 'Tải tất cả ảnh thành công');
        actionResult();
    } catch (error) {
        console.error('Download process failed:', error);
        toastError('Thông báo', 'Tải ảnh thất bại');
    }
};
export const downloadAudioFile = async (folder, dataFiles, type, actionResult) => {
    try {
        if (Platform.OS === 'ios') {
            const existingFiles = await Promise.all(
                dataFiles.map(async ({ url }) => {
                    const fileExists = await RNFS.exists(url);
                    return fileExists ? url : null;
                })
            );
            const urls = existingFiles.filter((url) => url !== null);
            if (urls.length > 0) {
                const options = {
                    title: 'Share',
                    urls: urls,
                };
                try {
                    await Share.open(options);
                    toastSuccess('Thông báo', `Lưu file ${type === 'PHOTO' ? 'ảnh' : 'ghi âm'} thành công`);
                    actionResult();
                } catch (err) {
                    console.log('Error:', err);
                }
            } else {
                if (type === 'PHOTO') {
                    downloadImage(dataFiles, actionResult)
                } else {
                    toastError('Thông báo', 'Không có dữ liệu file ghi âm (Hoặc file không tồn tại)');
                }
            }
        } else {
            const downloadPromises = dataFiles.map(async ({ url }) => {
                const fileExists = await RNFS.exists(url);
                if (fileExists) {
                    const fileName = url.split('/').pop();
                    const targetPath = `${folder}/${fileName}`;
                    await RNFS.copyFile(url, targetPath);
                    console.log(`Download: ${targetPath}`);
                }
            });
            await Promise.all(downloadPromises);
            toastSuccess('Thông báo', 'Lưu file ghi âm thành công');
            actionResult();
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
export const checkLinkType = (path) => {
    if (isValidField(path)) {
        if (path.startsWith('/data/user/')) {
            return `file://${path}`;
        } else if (path.startsWith('/var/mobile/Containers/Data/Application/')) {
            return `file://${path}`;
        } else if (path.startsWith('/uploaded/')) {
            return `${appConfig.URL_ROOT}${path}`;
        }
    }
    return path;
}
export const handlerGoBack = (navigation) => {
    try {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
        }
    } catch (e) {
        console.log('handlerGoBack: ', e, navigation);
    }
}
export const formatDateTimeVN = (time, formatType) => {
    try {
        return moment(time).format(formatType || 'DD/MM, YYYY')
    } catch (e) {
        console.log(e);
        return time
    }
}
export const removeFormatNumber = (text) => {
    const replacedString = text.replace(/,/g, "");
    return replacedString
}
export const formatDecimal = (text) => {
    const replacedString = text.replace(/,/g, ".");
    return replacedString.replace(/^(\d*\.\d*)(\.+.*)$/, "$1");
};

export const resizedPhotos = async (photos) => {
    try {
        let photoResult = []
        if (isValidData(photos)) {
            for (let index = 0; index < photos.length; index++) {
                const item = photos[index];
                const resizedImage = await ImageResizer.createResizedImage(item.uri, 1920, 1920, 'JPEG', 90);
                photoResult.push(resizedImage)
            }
            return photoResult
        }
    } catch (resizeError) {
        console.error('Lỗi khi resize ảnh:', resizeError);
        return photos;
    }
}
export const resizeImage = async (uri) => {
    const resizedImage = await ImageResizer.createResizedImage(uri, 1920, 1920, 'JPEG', 80);
    return moveFile(resizedImage.uri)
}
export const checkOldDate = (auditDate = 0, actionResult) => {
    const today = moment().format('YYYYMMDD')
    actionResult && actionResult(auditDate > today)
}
export const processImagePath = (photoPath) => {
    if (photoPath) {
        if (photoPath.includes('/uploaded/')) {
            return `${appConfig.URL_ROOT}${photoPath}`;
        }
        if (photoPath.includes('/data')) {
            return `file://${photoPath}`;
        }
        if (photoPath.includes('/var/mobile')) {
            return `file://${photoPath}`;
        }
    }
    return photoPath;
}
export const getFileNameWithoutExtension = (filePath) => {
    const fileName = filePath.split('/').pop();
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    return `${nameWithoutExtension}.webp`;
}
export const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'png':
            return 'image/png'
        case 'webp':
            return 'image/webp'
        case 'mp3':
        case 'mpeg':
            return 'audio/mpeg'
        case 'm4a':
            return 'audio/x-m4a'
        default:
            return 'image/jpeg'
    }
}
export const moveFile = async (sourcePath) => {
    try {
        // Kiểm tra file nguồn có tồn tại không
        const fileExists = await RNFS.exists(sourcePath);
        const fileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
        if (!fileExists) {
            return;
        }
        // Tạo thư mục đích nếu chưa tồn tại
        const destinationDir = `${RNFS.DocumentDirectoryPath}/${moment().format('YYYYMMDD')}`
        const dirExists = await RNFS.exists(destinationDir);
        if (!dirExists) {
            await RNFS.mkdir(destinationDir);
        }

        // Di chuyển file
        const destinationPath = `${destinationDir}/${fileName}`
        const fileMoveExists = await RNFS.exists(destinationPath);
        if (!fileMoveExists) {
            await RNFS.moveFile(sourcePath, destinationPath);
        } else {
            await RNFS.unlink(sourcePath);
        }
        return destinationPath
    } catch (error) {
        console.error('Lỗi chuyển file:', error);
        return sourcePath
    }
};
export const isNotInteger = (value) => {
    try {
        value = +value
        return value % 1 !== 0
    } catch (_) { return true }
}
export const SetStorageObject = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error(`Error:`, error);
    }
};
export const GetStorageObject = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        return null;
    }
};
export const calculateMinutesSince = (time) => {
    const inputTime = moment(time);
    const now = moment();
    const differenceInMinutes = inputTime.diff(now, 'minutes');
    return Math.abs(differenceInMinutes);
}
export const convertToReadableString = (data, title, body) => {
    if (!isValidData(data))
        return null
    return data.map((item) => `${item[title]}:\n${item[body]}`).join("\n\n");
};
export const BackupData = async () => {
    await UpdateDatabase.refreshDatabase()
    //
    const BUNDLE_ANDROID = await DeviceInfo.getBundleId();
    const dbName = await getDatabaseName();
    const path = Platform.OS === 'ios' ? `${RNFS.LibraryDirectoryPath}/LocalDatabase/` : `file:///data/data/${BUNDLE_ANDROID}/databases/`;
    const pathFile = `${path}${dbName}`;
    //
    const fileExists = await RNFS.exists(pathFile)
    if (fileExists) {
        const options = {
            title: 'Hỗ trợ app',
            type: 'application/x-sqlite3',
            fileName: dbName,
            url: pathFile,
            message: `File được xuất ra gửi từ ứng dụng ${appConfig.BRANDNAME}`
        }
        await Share.open(options)
            .then(() => toastSuccess('Thông báo', 'Gửi File thành công'))
            .catch((err) => console.log('err', err))
    } else {
        toastError('Thông báo', 'File Database không tồn tại hoặc thiết bị không có quyền truy cập')
    }
}
export const getMaxDataByType = (data, keyValue, targetType) => {
    const filterList = _.filter(data, (e) => e[keyValue] === targetType);
    return _.maxBy(filterList, 'id');
};
export const getTimeInRange = (startHour, endHour, intervalMinutes, actionResult) => {
    const times = [];
    const startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0);

    while (startTime <= endTime) {
        const hours = startTime.getHours().toString();
        times.push(`${hours}`);
        startTime.setMinutes(startTime.getMinutes() + intervalMinutes);
    }
    const morning = times.filter(item => item >= 6 && item < 12)
    const afternoon = times.filter(item => item >= 12 && item < 18)
    const evening = times.filter(item => item >= 18)
    const result = [
        {
            period: 'Buổi sáng',
            times: morning
        },
        {
            period: 'Buổi chiều',
            times: afternoon
        },
        {
            period: 'Buổi tối',
            times: evening
        }
    ]
    actionResult && actionResult(result)
};
export function cleanURL(url) {
    if (!url) return '';
    url = url.replace(/(https?:)\/{1,}([^/])/g, '$1//$2');
    url = url.replace(/([^:])\/{2,}/g, '$1/');
    url = url.replace(/\\/g, '/');
    return url;
}
export const convertDataToString = (data = [], keyValue, keyName) => {
    if (isValidData(data)) {
        const selectedItems = data.filter(item => item[keyValue]);
        return selectedItems.map(item => item[keyName]).join(", ")
    }
    return null
}