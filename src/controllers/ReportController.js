import moment from "moment"
import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import { isValidData } from "../utils/validateData"
import { getFileNameWithoutExtension } from "../utils/helper"
import _ from 'lodash'

const GetDataRaw = async (shopId, reportId, reportDate) => {
    const sql = `SELECT * FROM ${Tables.mobileRaw.tableName} WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        const itemMain = items[0] || {}
        return {
            isDownload: true,
            data: items,
            lastUpdate: itemMain.lastUpdate || '',
            isUploaded: itemMain.isUploaded,
            isLocked: itemMain.isLocked
        }
    } else {
        return { isDownload: false }
    }
}
const DeleteReportbyId = async (shopId, reportId, reportDate) => {
    return await Database.executeDELETE(Tables.mobileRaw, ["shopId=? AND reportId=? AND reportDate=?"], [shopId, reportId, reportDate]);
}
const RefreshDataRaw = async (item, dataNew) => {
    const dataLocal = item.dataLocal || []
    const itemNew = _.filter(dataNew, (e) => e.ItemName == item.kpiName)[0] || {}
    const itemLocal = _.filter(dataLocal, (e) => e.ItemName == item.kpiName)[0] || {}
    const _dataNewList = JSON.parse(itemNew.JsonData)
    const _dataLocalList = JSON.parse(itemLocal.JsonData)
    //console.log(itemNew, item.kpiName)
    //
    if (isValidData(_dataLocalList)) {
        const keyMap = item.kpiName == 'VISIBILITY' ? 'ItemId' : 'ProductId'
        // Add
        let _dataUpdate = []
        _.forEach(_dataNewList, (item) => {
            const isCheckAdd = _.some(_dataLocalList, (e) => e[keyMap] == item[keyMap])
            if (!isCheckAdd) {
                _dataUpdate.push(item)
            }
        })
        if (isValidData(_dataUpdate)) {
            const mapList = _.unionBy(_dataLocalList, _dataUpdate, keyMap)
            const sort_mapList = _.orderBy(mapList, ['BrandId', 'BrandName', 'SortList', keyMap], ['asc', 'asc', 'asc', 'asc']);
            const map_listUpdate = _.map(dataLocal, (e) => {
                return e.ItemName == item.kpiName ? { ...e, JsonData: JSON.stringify(sort_mapList) } : e
            })
            await REPORT_CONTROLLER.UpdateDataRaw(item.shopId, item.reportId, item.reportDate, map_listUpdate)
        }

        // Remove 
        const minusList = _.filter(mapList, item1 => _.some(_dataNewList, item2 => item2[keyMap] === item1[keyMap]))
        const sort_minusList = _.orderBy(minusList, ['BrandId', 'BrandName', 'SortList', keyMap], ['asc', 'asc', 'asc', 'asc']);
        const remove_listUpdate = _.map(dataLocal, (e) => {
            return e.ItemName == item.kpiName ? { ...e, JsonData: JSON.stringify(sort_minusList) } : e
        })
        await REPORT_CONTROLLER.UpdateDataRaw(item.shopId, item.reportId, item.reportDate, remove_listUpdate)
    }
    // Result
    const dataResult = await REPORT_CONTROLLER.GetDataRaw(item.shopId, item.reportId, item.reportDate)
    return {
        data: JSON.parse(dataResult.data[0]?.jsonData || '[]'),
        lastUpdate: dataResult.lastUpdate
    }
}
const InsertDataRaw = async (data) => {
    await Database.executeINSERT(Tables.mobileRaw, [data])
}
const UpdateDataRaw = async (shopId, reportId, reportDate, data) => {
    const lastUpdate = moment().format('HH:mm:ss - DD/MM')
    const sql = `UPDATE ${Tables.mobileRaw.tableName} 
        SET jsonData='${JSON.stringify(data)}',
            lastUpdate='${lastUpdate}'
        WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
    await Database.executeSQL(sql)
}
const SetLockDataRaw = async (shopId, reportDate, reportId) => {
    const sql = `UPDATE ${Tables.mobileRaw.tableName} SET isLocked=1 WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
    await Database.executeSQL(sql)
}
const SetDoneUploadRaw = async (shopId, reportDate, reportId) => {
    if (shopId) {
        const sql = `UPDATE ${Tables.mobileRaw.tableName} SET isUploaded=1,isLocked=1 WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
        await Database.executeSQL(sql)
    }
}
const RemoveDataRaw = async (shopId, reportId, reportDate) => {
    const sql = `DELETE FROM ${Tables.mobileRaw.tableName} WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
    await Database.executeSQL(sql)
}
//
const GetDataReportUpload = async (info, actionResult) => {
    // Data Input
    let sql = `SELECT * FROM ${Tables.mobileRaw.tableName} WHERE shopId=${info.shopId} AND reportDate=${info.auditDate} AND reportId=${info.reportId}`
    const itemData = await Database.executeSQL(sql)
    let dataUpload = itemData.items[0] || {}

    // Data Photo
    let sqlPhoto = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${info.shopId} AND photoDate=${info.auditDate} AND reportId=${info.reportId}`
    const itemPhoto = await Database.executeSQL(sqlPhoto)
    let jsonPhoto = itemPhoto.items || []
    for (let i = 0, lenData = jsonPhoto.length; i < lenData; i++) {
        const item = jsonPhoto[i]
        let imageName = getFileNameWithoutExtension(item.photoPath)
        item.photoPath = `/uploaded/${item.photoDate}/${imageName}`
    }
    dataUpload.jsonPhoto = JSON.stringify(jsonPhoto)

    // Data Audio
    let sqlAudio = `SELECT * FROM ${Tables.audios.tableName} WHERE shopId=${info.shopId} AND audioDate=${info.auditDate}`
    const itemAudio = await Database.executeSQL(sqlAudio)
    let jsonAudio = itemAudio.items || []
    for (let i = 0, lenData = jsonAudio.length; i < lenData; i++) {
        const item = jsonAudio[i]
        item.audioPath = `/uploaded/${item.audioDate}/${item.fileName}`
    }
    dataUpload.jsonAudio = JSON.stringify(jsonAudio)
    // Result
    actionResult && actionResult(dataUpload)
    return dataUpload
}
const GetDataReportPendingUpload = async (actionResult) => {
    let dataResult = []
    const sql = `SELECT * FROM ${Tables.mobileRaw.tableName} WHERE isLocked=1 AND isUploaded=0`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let index = 0; index < items.length; index++) {
            const data = items[index];
            const params = {
                shopId: data.shopId,
                auditDate: data.reportDate,
                reportId: data.reportId
            }
            const itemUpload = await GetDataReportUpload(params)
            dataResult.push(itemUpload)
        }
    }
    actionResult && actionResult(dataResult)
    return dataResult
}
const GetDataOverviewUpload = async (info, actionResult) => {
    let dataUpload = {
        shopId: info.shopId,
        reportDate: info.auditDate
    }
    let sqlPhoto = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${info.shopId} AND photoDate=${info.auditDate} AND photoType IN ('OVERVIEW','SIGNBOARD')`
    const itemPhoto = await Database.executeSQL(sqlPhoto)
    let jsonPhoto = itemPhoto.items || []
    for (let i = 0, lenData = jsonPhoto.length; i < lenData; i++) {
        const item = jsonPhoto[i]
        let imageName = getFileNameWithoutExtension(item.photoPath)
        item.photoPath = `/uploaded/${item.photoDate}/${imageName}`
    }
    dataUpload.jsonPhoto = JSON.stringify(jsonPhoto)
    // Result
    actionResult && actionResult(dataUpload)
    return dataUpload
}
const GetDataCountStep = async (shopId, reportId, reportDate, actionResult) => {
    let sql = `SELECT * FROM ${Tables.mobileRaw.tableName} WHERE shopId=${shopId} AND reportId=${reportId} AND reportDate=${reportDate}`
    const item = await Database.executeSQL(sql)
    dataUpload = item.items[0] || {}
    actionResult && actionResult(dataUpload)
    return dataUpload
}
//
export const REPORT_CONTROLLER = {
    DeleteReportbyId, GetDataRaw, InsertDataRaw, UpdateDataRaw, RemoveDataRaw, RefreshDataRaw, SetDoneUploadRaw, SetLockDataRaw,
    GetDataReportUpload, GetDataReportPendingUpload, GetDataOverviewUpload, GetDataCountStep
}