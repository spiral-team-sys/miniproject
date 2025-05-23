import DeviceInfo from "react-native-device-info"
import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import { isValidData, isValidField, isValidObject } from "../utils/validateData"
import { checkLinkType, getFileNameWithoutExtension, processImagePath } from "../utils/helper"
import uuid from 'react-native-uuid'
import moment from "moment"
import RNFS from 'react-native-fs'
import _ from 'lodash';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { KEYs } from "../utils/storageKeys"
import { TODAY } from "../utils/utility"

const GetDataPhoto = async (shopId, reportId, photoDate, actionResult) => {
    const sql = `SELECT *, photoPath AS [url] 
        FROM ${Tables.photos.tableName} 
        WHERE shopId=${shopId} 
        ${reportId > 0 ? `AND reportId=${reportId}` : ``} 
        AND photoDate=${photoDate}
    `
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        const _photoList = _.map(items, (e) => {
            return { ...e, photoPath: checkLinkType(e.photoPath), url: checkLinkType(e.photoPath) }
        })
        actionResult && actionResult(_photoList)
        return _photoList
    } else {
        actionResult && actionResult(items)
        return items
    }
}
const GetDataGallaryReport = async (shopInfo, actionResult) => {
    const sql = `SELECT photoTime AS id, photoPath AS url,*
        FROM ${Tables.photos.tableName} 
        ${shopInfo.byShop ? `WHERE shopId=${shopInfo.shopId}` : ``}
        ORDER BY photoDate DESC, photoFullTime DESC
    `
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        const dataPhotos = _.map(items, (e) => ({ ...e, url: processImagePath(e.photoPath) }))
        // Group Data 
        const groupedData = _.reduce(dataPhotos, (data, item) => {
            const date = item.photoDate;
            if (!data[date])
                data[date] = []
            data[date].push(item);
            return data;
        }, {})
        const jsonData = Object.keys(groupedData).map((dateView) => ({ dateView, photos: groupedData[dateView] })).sort((a, b) => b.dateView - a.dateView);
        //
        actionResult && actionResult(jsonData)
        return jsonData
    }
    return []
}
const GetDataPhotoByType = async (shopId = 0, reportId, photoDate = 0, photoType, actionResult) => {
    const formattedPhotoType = Array.isArray(photoType) ? photoType.map(type => `'${type}'`).join(', ') : `'${photoType}'`;
    const sql = `SELECT *, 'file://'||photoPath AS url
        FROM ${Tables.photos.tableName} 
        WHERE shopId = ${shopId} AND reportId = ${reportId} AND photoDate = ${photoDate} AND photoType IN (${formattedPhotoType})`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const SetDataPhotoReport = async (photos = [], data = {}) => {
    let reportPhotos = []
    if (isValidData(photos)) {
        for (let index = 0; index < photos.length; index++) {
            const item = photos[index];
            //
            const photoName = getFileNameWithoutExtension(item.uri)
            const photoInfo = await _defaultPhotoInfo(data)
            reportPhotos.push({ ...photoInfo, photoPath: item.uri, photoName: photoName })
        }
    }
    //
    if (isValidData(reportPhotos)) {
        await InsertDataPhoto(reportPhotos)
    }
    return reportPhotos
}
const SetDataPhotoOverview = async (photos = [], data = {}) => {
    let overviewPhoto = []
    if (isValidData(photos)) {
        for (let index = 0; index < photos.length; index++) {
            const item = photos[index];
            //
            const photoName = getFileNameWithoutExtension(item.uri)
            const photoInfo = await _defaultPhotoInfo(data)
            overviewPhoto.push({ ...photoInfo, photoPath: item.uri, photoName: photoName })
        }
    }
    if (isValidData(overviewPhoto)) {
        await InsertDataPhoto(overviewPhoto)
        return overviewPhoto[0] || {}
    }
    return {}
}
const InsertDataPhoto = async (data) => {
    await Database.executeINSERT(Tables.photos, data)
}
const DeleteDataPhoto = async (data, actionResult) => {
    const whereArgs = _.map(data, 'id');
    const _whereClause = `id IN(${whereArgs.map(() => '?').join(', ')})`;
    // Remove File 
    for (const item of data) {
        if (item.photoPath) {
            const filePath = `${RNFS.DocumentDirectoryPath}${item.photoPath} `;
            try {
                const fileExists = await RNFS.exists(filePath);
                if (fileExists) {
                    await RNFS.unlink(filePath);

                }
            } catch (error) {
                console.error(`Lỗi xóa File ${filePath}: `, error);
            }
        }
    }
    // 
    await Database.executeDELETE(Tables.photos, _whereClause, whereArgs)
    //
    actionResult && actionResult()
}
// Upload Photo
const GetDataUploadFilePhoto = async (shopInfo) => {
    let result = []
    const sql = `SELECT * FROM ${Tables.photos.tableName} AS a WHERE (a.fileUpload IS NULL OR a.fileUpload != 1) ${shopInfo?.shopId > 0 ? `AND shopId=${shopInfo.shopId}` : ``} `
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let item of items) {
            const data = {
                id: item.id,
                shopId: item.shopId,
                shopCode: item.shopCode,
                photoPath: item.photoPath,
                photoName: item.photoName || getFileNameWithoutExtension(item.photoPath),
                photoDate: item.photoDate,
                photoFullTime: item.photoFullTime,
                photoType: item.photoType
            }
            result.push(data)
        }
    }
    return result
}
const SetDoneUploadFilePhoto = async (photoId) => {
    const sql = `UPDATE ${Tables.photos.tableName} SET fileUpload = 1 WHERE id = ${photoId}`
    await Database.executeSQL(sql)
}
//
const _defaultPhotoInfo = async (tempInfo) => {
    const deviceId = await DeviceInfo.getUniqueId()
    const info = {
        shopId: tempInfo.shopId,
        shopCode: tempInfo.shopCode,
        shopName: tempInfo.shopName,
        address: tempInfo.address,
        photoDate: tempInfo.auditDate,
        shiftCode: tempInfo.shiftCode,
        reportId: tempInfo.reportId,
        photoDesc: tempInfo.photoDesc || '',
        photoType: tempInfo.photoType || 'NO-TYPE',
        photoMore: tempInfo.photoMore || '',
        guid: uuid.v4(),
        latitude: tempInfo.latitude || 0,
        longitude: tempInfo.longitude || 0,
        accuracy: tempInfo.accuracy || 0,
        mocked: false,
        refId: 0,
        dataUpload: 0,
        fileUpload: 0,
        gpsAddress: `${deviceId} `,
        photoTime: new Date().getTime(),
        photoFullTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    return info
}
const GetALLFile = async () => {
    const sql = `SELECT photoDate, photoType, photoPath FROM photos`
    const { items } = await Database.executeSQL(sql)
    return items;
}
const DeletePhotoByType = async (photoType, actionResult) => {
    const sql = `DELETE FROM ${Tables.photos.tableName} WHERE photoType=${photoType}`
    await Database.executeSQL(sql)
    actionResult && actionResult()
}
const AutoRemovePhoto = async () => {
    await AsyncStorage.getItem(KEYs.STORAGE.AUTO_DELETE_PHOTO).then(async (value) => {
        if (isValidField(value)) {
            let photoDate = 0
            const autoDeletePhoto = JSON.parse(value || {})
            if (isValidObject(autoDeletePhoto)) {
                switch (autoDeletePhoto.type) {
                    case 'DAYS':
                        const _dateValue = autoDeletePhoto.dateValue || 0
                        photoDate = (_dateValue == TODAY.integer) ? _dateValue : 0
                        break
                    case 'WEEK':
                        const startInWeek = moment().startOf('week').format('YYYYMMDD')
                        photoDate = (startInWeek == TODAY.integer) ? startInWeek : 0
                        break
                    case 'MONTH':
                        const startInMonth = moment().startOf('month').format('YYYYMMDD')
                        photoDate = (startInMonth == TODAY.integer) ? startInMonth : 0
                        break
                    case 'YEAR':
                        const startInYear = moment().startOf('year').format('YYYYMMDD')
                        photoDate = (startInYear == TODAY.integer) ? startInYear : 0
                        break
                }
                if (photoDate > 0) {
                    const sql = `SELECT * 
                    FROM ${Tables.photos.tableName} AS p 
                    WHERE p.photoDate<=${photoDate} AND p.photoDate<>${TODAY.integer}
                    AND (p.dataUpload <> 0 OR p.dataUpload IS NOT NULL) AND (p.fileUpload <> 0 OR p.fileUpload IS NOT NULL)`
                    const { items } = await Database.executeSQL(sql)
                    if (isValidData(items)) {
                        await PHOTO_CONTROLLER.DeleteDataPhoto(items)
                    }
                }
            }
        }
    })
}
//
export const PHOTO_CONTROLLER = {
    GetDataGallaryReport, GetDataPhoto, GetDataPhotoByType, GetALLFile,
    SetDataPhotoReport, InsertDataPhoto, DeleteDataPhoto,
    GetDataUploadFilePhoto, SetDoneUploadFilePhoto, SetDataPhotoOverview, DeletePhotoByType, AutoRemovePhoto
}