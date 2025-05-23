import _ from 'lodash';
import { isValidData } from "../utils/validateData";
import { REPORT_CONTROLLER } from "./ReportController";

const SetDataDisplayNo = async (item, actionResult) => {
    if (isValidData(item.dataLocal)) {
        const dataUpdate = _.map(item.dataLocal, (e) => {
            if (e.ItemName == item.kpiName) {
                const jsonData = JSON.parse(e.JsonData || '[]')
                if (isValidData(jsonData)) {
                    const _updateDisplay = _.map(jsonData, (i) => { return { ...i, DisplayValue: 0 } })
                    return { ...e, JsonData: JSON.stringify(_updateDisplay) }
                } else {
                    return e
                }
            } else {
                return e
            }
        })
        await REPORT_CONTROLLER.UpdateDataRaw(item.shopId, item.reportId, item.reportDate, dataUpdate)
        actionResult && actionResult(dataUpdate)
    }
}
const SetDataPriceNone = async (item, actionResult) => {
    if (isValidData(item.dataLocal)) {
        const dataUpdate = _.map(item.dataLocal, (e) => {
            if (e.ItemName == item.kpiName) {
                const jsonData = JSON.parse(e.JsonData || '[]')
                if (isValidData(jsonData)) {
                    const _updatePrice = _.map(jsonData, (i) => { return { ...i, PriceValue: 0 } })
                    return { ...e, JsonData: JSON.stringify(_updatePrice) }
                } else {
                    return e
                }
            } else {
                return e
            }
        })
        await REPORT_CONTROLLER.UpdateDataRaw(item.shopId, item.reportId, item.reportDate, dataUpdate)
        actionResult && actionResult(dataUpdate)
    }
}
//
export const AUDIT_CONTROLLER = { SetDataDisplayNo, SetDataPriceNone }