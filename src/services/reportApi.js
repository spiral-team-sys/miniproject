import moment from "moment";
import { get, getToken, post } from "./apiManager";
import { REPORT_CONTROLLER } from "../controllers/ReportController";
import { isValidData } from "../utils/validateData";
import { PHOTO_CONTROLLER } from "../controllers/PhotoController";
import { AUDIO_CONTROLLER } from "../controllers/AudioController";
import { toastError, toastSuccess } from "../utils/configToast";
import appConfig from "../utils/appConfig/appConfig";
import { getFileType } from "../utils/helper";
import RNFS from 'react-native-fs'
import _ from 'lodash';
import { Database } from "../database/Database";

const GetDataByShop = async (item, actionResult) => {
    try {
        // await Database.executeSQL(`DELETE FROM mobileRaw WHERE shopId=${item.shopId} AND reportId=${item.reportId} AND reportDate=${item.reportDate}`) 
        const itemRaw = await REPORT_CONTROLLER.GetDataRaw(item.shopId, item.reportId, item.reportDate);
        if (!itemRaw.isDownload) {
            const response = await post('download/reportbyshop', JSON.stringify(JSON.stringify(item)));
            if (response.statusId == 200) {
                const lastUpdate = moment().format('HH:mm:ss - DD/MM')
                if (isValidData(response.data)) {
                    const itemData = response.data[0] || {}
                    const jsonData = JSON.parse(itemData.jsonData || '[]')
                    const jsonPhoto = JSON.parse(itemData.jsonPhoto || '[]')
                    const isUploaded = itemData.isUploaded == 1 || false
                    const isLocked = itemData.isLocked == 1 || false
                    // Create new data 
                    await REPORT_CONTROLLER.InsertDataRaw({ ...itemData, lastUpdate })
                    actionResult && actionResult(jsonData, jsonPhoto, lastUpdate, isUploaded, isLocked);
                } else {
                    actionResult && actionResult([], [], 'Dữ liệu trống', 0, 0);
                }
            } else {
                actionResult && actionResult([], [], 'Chưa cập nhật dữ liệu', 0, 0, response.message)
            }
        } else {
            const jsonData = JSON.parse(itemRaw.data[0]?.jsonData || '[]')
            const jsonPhoto = JSON.parse(itemRaw.data[0]?.jsonPhoto || '[]')
            actionResult && actionResult(jsonData, jsonPhoto, itemRaw.lastUpdate, itemRaw.isUploaded, itemRaw.isLocked)
        }
    } catch (error) {
        actionResult && actionResult([], [], null, 0, 0, `Lỗi dữ liệu : GetDataByShop - ${error}`)
    }
}
const RefreshDataByShop = async (item, actionResult) => {
    try {
        const request = { shopId: item.shopId, reportDate: item.reportDate, reportId: item.reportId }
        const response = await post('download/reportbyshop', JSON.stringify(JSON.stringify(request)));
        if (response.statusId == 200) {
            if (isValidData(response.data)) {
                const itemData = response.data[0] || []
                const jsonData = JSON.parse(itemData.jsonData || '[]')
                const { data, lastUpdate } = await REPORT_CONTROLLER.RefreshDataRaw(item, jsonData)
                actionResult(data, lastUpdate);
            }
        }
    } catch (error) {
        actionResult([], null, false, `Lỗi dữ liệu : RefreshDataByShop - ${error}`)
    }
}
const UploadDataReport = async (data, actionResult) => {
    try {
        const response = await post('upload/uploadraw', JSON.stringify(data))
        if (response.statusId == 200) {
            await REPORT_CONTROLLER.SetDoneUploadRaw(data.shopId, data.reportDate, data.reportId)
        }
        //

        actionResult && actionResult(response)
    } catch (e) {
        toastError('Lỗi gửi dữ liệu', `${e}`)
    }
}
// Edit Report
const GetDataAuditUpdate = async (actionResult) => {
    try {
        const response = await get('download/auditresult_date');
        if (response.statusId == 200) {
            actionResult && await actionResult(response.data, null);
        }
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataAuditUpdate - ${error}`)
        return []
    }
}
const GetDataDetailAuditUpdate = async (info, actionResult) => {
    try {
        const header = { ShopId: info.ShopId, AuditDate: info.AuditDate }
        const response = await get('download/shopedit', header);
        if (response.statusId == 200) {
            actionResult && await actionResult(response.data, null);
        }
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataStoreList - ${error}`)
        return []
    }
}
//
const UploadFileAction = async (item) => {
    try {
        const { id, photoType, photoName, photoPath, photoDate, photoFullTime, shopCode } = item;
        if (await RNFS.exists(photoPath)) {
            const filePath = `${RNFS.DocumentDirectoryPath}/${photoName}`;
            if (await RNFS.exists(filePath)) {
                await RNFS.unlink(filePath);
            }
            await RNFS.copyFile(photoPath, filePath);
            // FormData 
            const formData = new FormData();
            formData.append('file', {
                uri: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
                name: photoName,
                type: getFileType(photoName)
            });
            formData.append('FileName', photoName);
            formData.append('ShopCode', shopCode);
            formData.append('PhotoTime', photoFullTime);
            formData.append('PhotoDate', photoDate);
            formData.append('PhotoType', photoType);
            //
            const token = await getToken();
            const response = await fetch(`${appConfig.URL_ROOT}file/upload-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                const responseData = await response.json();
                if (photoType === 'AUDIO') {
                    AUDIO_CONTROLLER.SetDoneUploadFileAudio(id);
                } else {
                    PHOTO_CONTROLLER.SetDoneUploadFilePhoto(id);
                }
                return { status: true, url: responseData.filePath };
            } else {
                const errorText = await response.text();
                console.log("Upload failed:", errorText);
                return { status: false, error: errorText };
            }
        } else {
            toastError("404", `File  ${photoName} không có trong điện thoại của bạn`)
            return { status: "File does not exist" };
        }
    } catch (error) {
        console.log('UploadFileAction Error:', error);
        return { status: "Error uploading image", error: error.message };
    }
};
const UploadFileReport = async (shopInfo, maxCurrent = 5) => {
    try {
        const dataPhoto = await PHOTO_CONTROLLER.GetDataUploadFilePhoto(shopInfo)
        const dataAudio = await AUDIO_CONTROLLER.GetDataUploadFileAudio(shopInfo)
        const dataUpload = _.concat(dataPhoto, dataAudio)
        if (isValidData(dataUpload)) {
            let queue = []
            for (let index = 0; index < dataUpload.length; index++) {
                const item = dataUpload[index];
                const uploadPromise = UploadFileAction(item).then(result => ({ status: 'success', result })).catch(error => ({ status: 'rejected', error }));
                queue.push(uploadPromise);
                //
                if (queue.length >= maxCurrent) {
                    await Promise.race(queue);
                    queue = queue.filter(p => p.status !== 'success');
                }
                //
                await Promise.all(queue);
                console.log(`Gửi ${item.photoType == 'AUDIO' ? 'ghi âm' : 'hình ảnh'} thành công`);
            }
        } else {
            toastSuccess('Thông báo', 'Đã đẩy hết các file')
        }
    } catch (error) {
        console.log("Gửi File thất bại: ", error);
    }
}
const UploadOnlyAudio = async (shopInfo, maxCurrent = 5) => {
    try {
        const dataUpload = await AUDIO_CONTROLLER.GetDataUploadFileAudio(shopInfo)
        if (isValidData(dataUpload)) {
            let queue = []
            for (let index = 0; index < dataUpload.length; index++) {
                const item = dataUpload[index];
                const uploadPromise = UploadFileAction(item).then(result => ({ status: 'success', result })).catch(error => ({ status: 'rejected', error }));
                queue.push(uploadPromise);
                //
                if (queue.length >= maxCurrent) {
                    await Promise.race(queue);
                    queue = queue.filter(p => p.status !== 'success');
                }
                //
                await Promise.all(queue);
                console.log(`Gửi ghi âm thành công`);
            }
        }
    } catch (error) {
        console.log("Gửi File thất bại: ", error);
    }
}
//
export const REPORT_API = { GetDataByShop, RefreshDataByShop, UploadDataReport, UploadFileReport, UploadFileAction, GetDataAuditUpdate, GetDataDetailAuditUpdate, UploadOnlyAudio }