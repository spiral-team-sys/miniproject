import { Database } from "../database/Database"
import { Tables } from "../database/Tables"

const GetDataMaster = async (info, actionResult) => {
    let refCodeString = ''
    let listCodeString = ''
    let sql = `SELECT * FROM ${Tables.masterList.tableName} WHERE 1=1`
    // ListCode
    if (info.listCode) {
        const listCodeArray = info.listCode.split(',').map(code => `'${code.trim()}'`);
        listCodeString = listCodeArray.join(',');
        sql += `${listCodeString ? ` AND listCode IN (${listCodeString})` : ''}`
    }
    // RefCode
    if (info.refCode) {
        const refCodeArray = info.refCode.split(',').map(code => `'${code.trim()}'`);
        refCodeString = refCodeArray.join(',');
        sql += `${refCodeString ? ` AND ref_Code IN (${refCodeString})` : ''}`
    }
    //
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const InsertDataMaster = async (data) => {
    await Database.executeINSERT(Tables.masterList, data)
}
const DeleteDataMaster = async () => {
    await Database.executeDELETE(Tables.masterList)
}

// Data Bridgetone
const InsertDataAxle = async (data) => {
    await Database.executeINSERT(Tables.axleList, data)
}
const DeleteDataAxle = async () => {
    await Database.executeDELETE(Tables.axleList)
}
//
export const MASTER_CONTROLLER = { GetDataMaster, InsertDataMaster, DeleteDataMaster, InsertDataAxle, DeleteDataAxle }