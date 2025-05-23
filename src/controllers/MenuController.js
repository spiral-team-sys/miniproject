import { Database } from "../database/Database"
import { Tables } from "../database/Tables"
import { ATTENDANT_CONTROLLER } from "./AttendanceController"

const GetDataMenuHome = async (actionResult) => {
    const sql = `SELECT * FROM ${Tables.menuList.tableName} WHERE byShop=0 ORDER BY sortList`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const GetDataMenuReport = async (shopInfo, actionResult, menuId) => {
    let modeResult = 'TC'
    if (shopInfo.shopId) {
        const itemMode = await ATTENDANT_CONTROLLER.GetModeResult(shopInfo)
        modeResult = itemMode.mode
    }
    //
    const sql = `SELECT * FROM ${Tables.menuList.tableName} 
        WHERE byShop=1 ${menuId ? `AND id=${menuId}` : ``}  ${modeResult == 'KTC' ? `AND id=1` : ``}
        ORDER BY sortList`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const GetDataReportChecked = async (shopInfo, actionResult) => {
    // Id không làm khảo sát cửa hàng
    const validShopFormatIds = [28, 43, 44, 53, 54];
    const sql = `SELECT m.*, 
        (SELECT r.isUploaded FROM ${Tables.mobileRaw.tableName} AS r WHERE r.reportId=m.id AND r.shopId=${shopInfo.shopId} AND r.reportDate=${shopInfo.auditDate}) AS isUploaded,
        (SELECT r.isLocked FROM ${Tables.mobileRaw.tableName} AS r WHERE r.reportId=m.id AND r.shopId=${shopInfo.shopId} AND r.reportDate=${shopInfo.auditDate}) AS isLocked
        FROM ${Tables.menuList.tableName} AS m
        WHERE m.byShop=1 AND m.id<>1 
        ${validShopFormatIds.includes(shopInfo.shopFormatId) ? `AND m.id<>39` : ``}
        ORDER BY m.sortList`
    const { items } = await Database.executeSQL(sql)
    actionResult && actionResult(items)
    return items
}
const InsertDataMenu = async (data) => {
    await Database.executeINSERT(Tables.menuList, data)
}
const DeleteDataMenu = async () => {
    await Database.executeDELETE(Tables.menuList)
}
//
export const MENU_CONTROLLER = { GetDataMenuHome, GetDataMenuReport, GetDataReportChecked, InsertDataMenu, DeleteDataMenu }