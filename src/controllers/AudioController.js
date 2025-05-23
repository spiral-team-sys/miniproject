import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import { isValidData } from "../utils/validateData";
import _ from 'lodash';

const GetDataAudio = async (shopId, audioDate, actionResult) => {
    const sql = `SELECT * FROM ${Tables.audios.tableName} WHERE shopId=${shopId} AND reportId=-1 AND audioDate=${audioDate}`
    console.log(sql);

    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
}
const GetDataGallaryAudio = async (shopId, actionResult) => {
    const sql = `SELECT *, audioPath AS url FROM ${Tables.audios.tableName} WHERE shopId=${shopId} AND reportId=-1`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
}
const InsertDataAudio = async (audioInfo) => {
    await Database.executeINSERT(Tables.audios, [audioInfo])
}
const DeleteDataAudio = async (data, actionResult) => {
    const whereArgs = _.map(data, 'id');
    const _whereClause = `id IN (${whereArgs.map(() => '?').join(', ')})`;
    // 
    await Database.executeDELETE(Tables.audios, _whereClause, whereArgs)
    actionResult && actionResult()
}
const GetDataUploadFileAudio = async (shopInfo) => {
    let result = []
    const sql = `SELECT * FROM ${Tables.audios.tableName} AS a WHERE (a.fileUpload IS NULL OR a.fileUpload !=1) ${shopInfo?.shopId > 0 ? `AND shopId=${shopInfo.shopId}` : ``}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let item of items) {
            if (item.audioPath !== 'Already stopped') {
                const data = {
                    id: item.id,
                    shopId: item.shopId,
                    photoPath: item.audioPath,
                    photoName: item.fileName || item?.audioPath?.substring(item?.audioPath?.lastIndexOf('/') + 1, item.audioPath.length),
                    photoDate: item.audioDate,
                    photoType: 'AUDIO'
                }
                result.push(data)
            }
        }
    }
    return result
}
const SetDoneUploadFileAudio = async (audioId) => {
    const sql = `UPDATE ${Tables.audios.tableName} SET fileUpload=1 WHERE id=${audioId}`
    await Database.executeSQL(sql)
}
//
const GetJsonAudioUpload = async (info) => {
    const sqlAudio = `SELECT * FROM ${Tables.audios.tableName} WHERE shopId=${info.shopId} AND audioDate=${info.auditDate}`
    const { items } = await Database.executeSQL(sqlAudio)
    //
    let jsonAudio = items || []
    for (let i = 0, lenData = jsonAudio.length; i < lenData; i++) {
        const item = jsonAudio[i]
        item.audioPath = `/uploaded/${item.audioDate}/${item.fileName}`
    }
    return JSON.stringify(jsonAudio)
}
//
export const AUDIO_CONTROLLER = { GetDataAudio, GetDataGallaryAudio, InsertDataAudio, DeleteDataAudio, GetDataUploadFileAudio, SetDoneUploadFileAudio, GetJsonAudioUpload }