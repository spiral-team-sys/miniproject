import { Database } from "../database/Database";
import { Tables } from "../database/Tables";
import uuid from 'react-native-uuid';
import { checkLinkType, convertDateTime } from "../utils/helper";
import { isValidData, isValidObject } from "../utils/validateData";
import { DATA_DEFAULT } from "../utils/data/dataDefault";
import appConfig from "../utils/appConfig/appConfig";
import moment from "moment";
import _ from 'lodash';
import { AUDIO_CONTROLLER } from "./AudioController";
import { DeviceEventEmitter } from "react-native";
import { KEYs } from "../utils/storageKeys";

const GetDataAttendance = async (info, actionResult) => {
    let dataResult = []
    const sql = `SELECT *, photoPath AS [url] FROM ${Tables.photos.tableName} 
        WHERE shopId=${info.shopId} 
        AND reportId=${info.reportId} 
        AND photoDate=${info.auditDate}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let index = 0; index < info.templateAttendance.length; index++) {
            const item = info.templateAttendance[index];
            const attendance = _.filter(items, (e) => e.photoType == item.id)[0] || {}
            //
            const itemSave = {
                ...item,
                attendanceId: attendance.id || 0,
                reportId: attendance.reportId,
                shopId: attendance.shopId,
                shopCode: attendance.shopCode,
                shiftCode: attendance.shiftCode,
                photoType: attendance.photoType,
                photoMore: attendance.photoMore,
                latitude: attendance.latitude,
                longitude: attendance.longitude,
                accuracy: attendance.accuracy,
                photoDate: attendance.photoDate,
                photoTime: attendance.photoTime,
                photoFullTime: attendance.photoFullTime,
                photoPath: attendance.photoPath,
                dataUpload: attendance.dataUpload,
                fileUpload: attendance.fileUpload,
                guid: attendance.guid,
                url: checkLinkType(attendance.photoPath)
            }
            dataResult.push(itemSave)
        }
        actionResult && actionResult(dataResult, true)
        return dataResult
    } else {
        actionResult && actionResult(info.templateAttendance, false)
        return info.templateAttendance
    }
}
const SaveAttendancePhoto = async (uri, shopInfo, menuReportInfo, locationInfo, cameraInfo) => {
    const modeResult = await ATTENDANT_CONTROLLER.GetDataMode(shopInfo)
    const photoInfo = {
        shopId: shopInfo.shopId,
        shopCode: shopInfo.shopCode,
        shopName: shopInfo.shopName,
        address: shopInfo.address,
        photoDate: moment().format('YYYYMMDD'),
        photoTime: new Date().getTime(),
        reportId: menuReportInfo.id,
        photoDesc: null,
        shiftCode: shopInfo.shiftCode,
        shiftName: shopInfo.shiftName,
        dataUpload: 1,
        fileUpload: 0,
        ...locationInfo,
        gpsAddress: null,
        photoType: cameraInfo.id,
        photoName: uri.substring(uri.lastIndexOf('/') + 1, uri.length),
        photoPath: uri.startsWith('file://') ? uri : `file://${uri}`,
        photoMore: "ATTENDANCE",
        guid: uuid.v4(),
        refId: modeResult.reasonId,
        refName: modeResult.mode,
        note: modeResult.note,
        photoFullTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    const result = await Database.executeINSERT(Tables.photos, [photoInfo])
    if (result.error) {
        return { isSuccess: false, messageError: result.error }
    } else {
        return { isSuccess: true, photoInfo }
    }
}
const DeleteAttendancePhoto = async (data, actionResult) => {
    const whereArgs = _.map(data, 'id');
    const _whereClause = `id IN (${whereArgs.map(() => '?').join(', ')})`;
    // 
    await Database.executeDELETE(Tables.photos, _whereClause, whereArgs)
    actionResult && actionResult()
}
const SetDoneUploadFileAttendance = async (photoInfo) => {
    const sql = `UPDATE ${Tables.photos.tableName} SET fileUpload=1, dataUpload=1WHERE id=${photoInfo.id}`
    await Database.executeSQL(sql)
}
const GetDataAttendancePending = async (info, actionResult) => {
    const sql = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${info.shopId} AND reportId=1 AND fileUpload=0`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const GetAttendanceInfo = async (shopInfo) => {
    const modeResult = await ATTENDANT_CONTROLLER.GetDataMode(shopInfo)
    const jsonAudio = await AUDIO_CONTROLLER.GetJsonAudioUpload(shopInfo);
    const photoInfo = {
        shopId: shopInfo.shopId,
        attendantDate: moment().format('YYYYMMDD'),
        refId: modeResult.reasonId,
        refName: modeResult.mode,
        note: modeResult.note,
        jsonAudio
    }
    return photoInfo
}
const SaveDataPhotoAttendance = async (photoInfo) => {
    const sql = `SELECT * FROM ${Tables.photos.tableName} 
        WHERE reportId=1 
        AND shopId=${photoInfo.shopId} 
        AND photoDate=${photoInfo.photoDate} 
        AND photoType=${photoInfo.photoType}`
    const { items } = await Database.executeSQL(sql)
    if (!isValidData(items)) {
        await Database.executeINSERT(Tables.photos, [photoInfo])
    }
    // 
    const sqlMode = `
        UPDATE ${Tables.attendanceMode.tableName} 
        SET isDoneReport=${photoInfo.photoType % 2 == 0 ? 1 : 0}
        WHERE shopId=${photoInfo.shopId} 
        AND auditDate=${photoInfo.photoDate}`
    await Database.executeSQL(sqlMode)
}
// Mode
const GetDataMode = async (info, actionResult) => {
    let modeResult = {}
    const sql = `SELECT a.*,m.nameVN AS reasonName
        FROM ${Tables.attendanceMode.tableName} AS a 
        LEFT JOIN ${Tables.masterList.tableName} AS m ON m.listCode='KTC' AND m.id=a.reasonId
        WHERE a.shopId=${info.shopId} 
        AND a.auditDate=${info.auditDate}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        const itemMode = items[0] || {}
        modeResult = itemMode
        const dataModeResult = _.map(DATA_DEFAULT.dataMode, (e) => { return e.ItemCode == (itemMode.mode || 'TC') ? { ...e, isActive: true } : { ...e, isActive: false } })
        actionResult && actionResult(dataModeResult, itemMode)
    } else {
        modeResult = { mode: 'TC' }
        await InsertDataMode(info, 'TC')
        actionResult && actionResult(DATA_DEFAULT.dataMode, { mode: 'TC', reasonId: 0, note: null, isDoneReport: 0 })
    }
    return modeResult
}
const GetModeResult = async (shopInfo, actionResult) => {
    const sql = `SELECT * FROM ${Tables.attendanceMode.tableName} WHERE shopId=${shopInfo.shopId} AND auditDate=${shopInfo.auditDate}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        actionResult && actionResult(items[0].mode)
    } else {
        actionResult && actionResult('TC')
    }
    return items[0] || {};
}
const InsertDataMode = async (info, mode) => {
    const params = [{
        shopId: info.shopId,
        auditDate: info.auditDate,
        mode: mode,
        isDoneReport: 0
    }]
    await Database.executeINSERT(Tables.attendanceMode, params)
}
const UpdateDataMode = async (info) => {
    const sql = `UPDATE ${Tables.attendanceMode.tableName} 
        SET mode='${info.mode}'
           ${info.isDoneReport ? `,isDoneReport=${info.isDoneReport}` : ''} 
           ${info.reasonId ? `,reasonId=${info.reasonId}` : ',reasonId=0'} 
           ${info.reasonName ? `,reasonName='${info.reasonName}'` : ',reasonName=null'} 
           ${info.note ? `,note='${info.note}'` : ',note=null'}  
        WHERE shopId=${info.shopId} 
        AND auditDate=${info.auditDate}
    `
    await Database.executeSQL(sql)
}
// Merge Data
const MergeDataFromServer = async (data, info) => {
    if (isValidData(data)) {
        let dataMerge = []
        for (let index = 0; index < info.templateAttendance.length; index++) {
            const item = info.templateAttendance[index];
            const attendanceList = _.filter(data, (e) => e.attendantType == item.id)
            // Merge Data
            if (isValidData(attendanceList)) {
                const itemMerge = attendanceList[0] || {}
                const photoInfo = {
                    shopId: itemMerge.shopId,
                    shopCode: itemMerge.shopCode,
                    photoDate: itemMerge.attendantDate,
                    photoTime: convertDateTime(itemMerge.attendantTime),
                    reportId: itemMerge.reportId,
                    shiftCode: itemMerge.shiftCode,
                    shiftName: itemMerge.shiftName,
                    dataUpload: 0,
                    fileUpload: 0,
                    latitude: itemMerge.latitude,
                    longitude: itemMerge.longitude,
                    photoType: item.id,
                    photoPath: itemMerge.imageUrl,
                    url: `${appConfig.URL_ROOT}${itemMerge.imageUrl}`,
                    photoMore: "ATTENDANCE",
                    dataUpload: 1,
                    fileUpload: 1,
                    refId: itemMerge.refId,
                    refName: itemMerge.refName,
                    note: itemMerge.note,
                    photoFullTime: moment(item.attendantTime).format('YYYY-MM-DD HH:mm:ss'),
                }
                dataMerge.push(photoInfo)
            }
        }
        // 
        if (dataMerge.length > 0) {
            await InsertAttendanceAfterMerge(info, dataMerge)
            DeviceEventEmitter.emit(KEYs.DEVICE_EVENT.RELOAD_DATA_MERGE_ATTENDANCE)
        }
    }
}
const InsertAttendanceAfterMerge = async (info, dataMerge) => {
    if (isValidData(dataMerge)) {
        let itemMode = {}
        // Merge Attendance Photo
        for (let index = 0; index < dataMerge.length; index++) {
            const merge = dataMerge[index];
            itemMode = {
                shopId: merge.shopId,
                auditDate: merge.photoDate,
                mode: merge.refName,
                note: merge.note,
                isDoneReport: (merge.photoType % 2 == 0 ? 1 : 0)
            }
            //
            const sql = `SELECT * FROM ${Tables.photos.tableName} 
                WHERE shopId=${info.shopId} 
                AND reportId=${info.reportId} 
                AND photoDate=${info.auditDate} 
                AND photoType='${merge.photoType}'
            `
            const { items } = await Database.executeSQL(sql)
            if (!isValidData(items)) {
                await Database.executeINSERT(Tables.photos, [merge])
            }
        }
        // Merge Attendance Mode 
        if (isValidObject(itemMode)) {
            await ATTENDANT_CONTROLLER.InsertDataMode(itemMode, itemMode.mode)
        }
    }
}
//
export const ATTENDANT_CONTROLLER = {
    GetDataAttendance, SaveAttendancePhoto, DeleteAttendancePhoto, GetDataAttendancePending, GetAttendanceInfo, SaveDataPhotoAttendance,
    GetDataMode, GetModeResult, InsertDataMode, UpdateDataMode,
    MergeDataFromServer, SetDoneUploadFileAttendance
}