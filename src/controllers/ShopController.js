import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import { TODAY } from "../utils/utility"
import { isValidData } from "../utils/validateData"
import { VALID_CONTROLLER } from "./ValidController"
import _ from 'lodash'

const GetDataShop = async (actionResult) => {
    const sql = `SELECT * FROM ${Tables.storeList.tableName} WHERE auditDate=${TODAY.integer}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let index = 0; index < items.length; index++) {
            const shop = items[index];
            const checked = await VALID_CONTROLLER.attendanceDone(shop)
            shop.status = checked.status
            shop.statusColor = checked.statusColor
            shop.statusName = checked.statusName
        }
    }
    //
    const orderList = _.orderBy(items, ['status'], ['asc']);
    actionResult && actionResult(orderList)
    return orderList
}
const InsertDataShop = async (data) => {
    await Database.executeINSERT(Tables.storeList, data)
}
const DeleteDataShop = async () => {
    await Database.executeDELETE(Tables.storeList)
}
const GetDataShopGallary = async (actionResult) => {
    const sql = `SELECT DISTINCT p.shopId,p.shopCode,p.shopName,p.address,sl.record,sl.isDoneReport
        FROM ${Tables.photos.tableName} AS p 
        LEFT JOIN ${Tables.storeList.tableName} AS sl ON sl.shopId=p.shopId`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
//
export const SHOP_CONTROLLER = { GetDataShop, InsertDataShop, DeleteDataShop, GetDataShopGallary }