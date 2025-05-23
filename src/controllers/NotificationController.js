import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import _ from 'lodash'

const GetDataNotification = async (actionResult) => {
    const sql = `SELECT *, 0 AS isChooseTag FROM ${Tables.notification.tableName} WHERE remove=0 ORDER BY activeDate DESC`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const CountNotification = async (actionResult) => {
    const sql = `SELECT COUNT(*) AS countValue FROM ${Tables.notification.tableName} WHERE sended <> 2`
    const { items } = await Database.executeSQL(sql)
    const countValue = items[0].countValue || 0
    actionResult && actionResult(countValue)
    return countValue
}
const GetMaxId = async () => {
    const sql = `SELECT MAX(id) AS NotifyId FROM ${Tables.notification.tableName}`
    const { items } = await Database.executeSQL(sql)
    return items[0].NotifyId || 0
}
const InsertDataNotification = async (data) => {
    await Database.executeINSERT(Tables.notification, data)
}
const DeleteDataNotification = async (data = [], actionResult) => {
    const whereArgs = _.map(data, 'id');
    const _whereClause = `id IN (${whereArgs.map(() => '?').join(', ')})`;
    await Database.executeDELETE(Tables.notification, _whereClause, whereArgs)
    actionResult && actionResult()
}
const SetReadNotification = async (id) => {
    const sql = `UPDATE ${Tables.notification.tableName} SET sended=2 WHERE id=${id}`
    await Database.executeSQL(sql)
}
export const NOTIFICATION_CONTROLLER = { GetDataNotification, GetMaxId, InsertDataNotification, DeleteDataNotification, SetReadNotification, CountNotification }