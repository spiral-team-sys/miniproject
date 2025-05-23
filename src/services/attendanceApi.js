import DeviceInfo from "react-native-device-info";
import { ATTENDANT_CONTROLLER } from "../controllers/AttendanceController";
import { toastError } from "../utils/configToast";
import { convertTimestamp, getBase64Image } from "../utils/helper";
import { get, post } from "./apiManager";
import { AUDIO_CONTROLLER } from "../controllers/AudioController";
import { isValidCoordinate, isValidData, isValidNumber } from "../utils/validateData";
import { VALID_CONTROLLER } from "../controllers/ValidController";
import appConfig, { eoeApp } from "../utils/appConfig/appConfig";
import { REPORT_API } from "./reportApi";
import uuid from 'react-native-uuid';
import _ from 'lodash'
import moment from "moment";

const getDataAttendance = async (data) => {
    try {
        await VALID_CONTROLLER.attendanceWork(data, async (isAttendance) => {
            if (!isAttendance) {
                const params = {
                    shopId: data.shopId,
                    attendantDate: data.auditDate
                }
                const response = await get('attendant/getbyshop', params)
                if (response.statusId == 200) {
                    await ATTENDANT_CONTROLLER.MergeDataFromServer(response.data, data)
                }
            }
        })
    } catch (error) {
        toastError('Lỗi dữ liệu: ', `getDataAttendance: ${error}`)
    }
};
const validateLocation = (accuracy, latitude, longitude) => {
    if (!isValidNumber(accuracy) || !isValidNumber(latitude) || !isValidNumber(longitude)) {
        return `Độ chính xác: ${accuracy} lat: ${latitude} long: ${longitude}`;
    }
    const coordinateError = isValidCoordinate(latitude, longitude);
    if (coordinateError) {
        return coordinateError;
    }

    return null;
};
const uploadAttendance = async (data, actionResult) => {
    try {
        const { accuracy, latitude, longitude } = data.locationInfo;
        const locationError = validateLocation(accuracy, latitude, longitude);
        if (locationError) {
            toastError('Lỗi lấy dữ liệu vị trí', locationError);
            return;
        }
        const { photoInfo, messageError } = await ATTENDANT_CONTROLLER.SaveAttendancePhoto(data.uri, data.shopInfo, data.menuReportInfo, data.locationInfo, data.cameraInfo);
        if (!photoInfo) {
            toastError('Chấm công', messageError);
            return;
        }
        const imageBase64 = await getBase64Image(photoInfo.photoPath);
        const jsonAudio = await AUDIO_CONTROLLER.GetJsonAudioUpload(data.shopInfo);
        const imageName = photoInfo.photoPath.substring(photoInfo.photoPath.lastIndexOf('/') + 1, photoInfo.photoPath.length);

        const itemAttendance = {
            shopId: data.shopInfo.shopId,
            shopCode: data.shopInfo.shopCode,
            attendantDate: data.shopInfo.auditDate,
            refId: photoInfo.refId,
            refName: photoInfo.refName,
            note: photoInfo.note,
            jsonData: JSON.stringify({
                ...photoInfo,
                base64: imageBase64,
                fileName: imageName,
                devicePath: photoInfo.photoPath,
                gpsTime: convertTimestamp(data.locationInfo.timestamp),
                deviceId: await DeviceInfo.getUniqueId()
            }),
            jsonAudio: jsonAudio
        };

        const endpoint = appConfig.APPID == eoeApp ? 'attendant/upload' : 'attendants/upload';
        const response = await post(endpoint, JSON.stringify(itemAttendance));
        if (response?.statusId == 200) {
            actionResult(response.messeger || response.messager);
            ATTENDANT_CONTROLLER.SetDoneUploadFileAttendance(photoInfo);
            REPORT_API.UploadOnlyAudio(data.shopInfo);
        } else {
            toastError('Lỗi gửi hình ảnh', response);
        }

    } catch (error) {
        toastError('Lỗi gửi dữ liệu', `${error}`);
    }
};
const updateWorkingStatus = async (data, actionResult) => {
    try {
        const response = await post('attendant/workstatus', JSON.stringify(JSON.stringify(data)))
        if (response?.statusId == 200 && isValidData(response.data))
            actionResult(response.data[0])
        else
            actionResult({ statusWorking: 'Bắt đầu làm việc', statusId: 0 })
    } catch (error) {
        toastError('Lỗi dữ liệu: ', `updateWorkingStatus: ${error}`)
    }
}
const uploadAttendancePending = async (info) => {
    const dataUpload = await ATTENDANT_CONTROLLER.GetDataAttendancePending(info)
    if (isValidData(dataUpload)) {
        for (let index = 0; index < dataUpload.length; index++) {
            const photoInfo = dataUpload[index];
            const imageBase64 = await getBase64Image(photoInfo.photoPath)
            const jsonAudio = await AUDIO_CONTROLLER.GetJsonAudioUpload(info)
            const imageName = photoInfo.photoPath.substring(photoInfo.photoPath.lastIndexOf('/') + 1, photoInfo.photoPath.length);
            //
            const itemAttendance = {
                shopId: info.shopId,
                shopCode: info.shopCode,
                attendantDate: info.auditDate,
                refId: photoInfo.refId,
                refName: photoInfo.refName,
                note: photoInfo.note,
                jsonData: JSON.stringify({
                    ...photoInfo,
                    base64: imageBase64,
                    fileName: imageName,
                    devicePath: photoInfo.photoPath,
                    deviceId: await DeviceInfo.getUniqueId()
                }),
                jsonAudio: jsonAudio
            }
            //
            const endpoint = appConfig.APPID == eoeApp ? 'attendant/upload' : 'attendants/upload'
            const response = await post(endpoint, JSON.stringify(itemAttendance))
            if (response) {
                if (response?.statusId == 200) {
                    ATTENDANT_CONTROLLER.SetDoneUploadFileAttendance(photoInfo)
                } else {
                    toastError('Lỗi gửi hình ảnh', response.messeger)
                }
            } else {
                toastError('Lỗi gửi hình ảnh', 'Quá thời gian chờ yêu cầu, Vui lòng thử lại')
            }
        }
    }
}
// Upload Attendance New 
const uploadDataAttendance = async (data, actionResult) => {
    try {
        const { accuracy, latitude, longitude } = data.locationInfo;
        const locationError = validateLocation(accuracy, latitude, longitude);
        if (locationError) {
            toastError('Lỗi lấy dữ liệu vị trí', locationError);
            return;
        }
        const attendanceInfo = await ATTENDANT_CONTROLLER.GetAttendanceInfo(data.shopInfo);
        const photoInfo = {
            ...data.locationInfo,
            fileName: data.uri.substring(data.uri.lastIndexOf('/') + 1, data.uri.length),
            shopId: data.shopInfo.shopId,
            shopCode: data.shopInfo.shopCode,
            shopName: data.shopInfo.shopName,
            address: data.shopInfo.address,
            photoDate: moment().format('YYYYMMDD'),
            photoTime: new Date().getTime(),
            reportId: data.menuReportInfo.id,
            shiftCode: data.shopInfo.shiftCode,
            shiftName: data.shopInfo.shiftName,
            dataUpload: 1,
            fileUpload: 0,
            photoType: data.cameraInfo.id,
            photoName: data.uri.substring(data.uri.lastIndexOf('/') + 1, data.uri.length),
            photoPath: data.uri.startsWith('file://') ? uri : `file://${data.uri}`,
            devicePath: data.uri.startsWith('file://') ? uri : `file://${data.uri}`,
            photoMore: "ATTENDANCE",
            guid: uuid.v4(),
            refId: attendanceInfo.reasonId,
            refName: attendanceInfo.mode,
            note: attendanceInfo.note,
            photoFullTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            gpsTime: convertTimestamp(data.locationInfo.timestamp),
            deviceId: await DeviceInfo.getUniqueId()
        }
        //
        const dataUpload = JSON.stringify({
            ...attendanceInfo,
            jsonData: JSON.stringify(photoInfo)
        })
        const response = await post(`${appConfig.APPID == eoeApp ? 'attendant' : 'attendants'}/uploaddata`, dataUpload);
        if (response?.statusId == 200) {
            await ATTENDANT_CONTROLLER.SaveDataPhotoAttendance(photoInfo)
            actionResult(response.messeger || response.messager);
        } else {
            toastError('Lỗi gửi hình ảnh', `${response.statusId}: ${response.messeger}`);
        }

    } catch (error) {
        toastError('Lỗi gửi dữ liệu', `${error}`);
    }
}
//
export const ATTENDANCE_API = { getDataAttendance, uploadAttendance, updateWorkingStatus, uploadAttendancePending, uploadDataAttendance }