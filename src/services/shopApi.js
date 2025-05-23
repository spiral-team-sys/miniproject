import { SHOP_CONTROLLER } from "../controllers/ShopController";
import appConfig, { eoeApp } from "../utils/appConfig/appConfig";
import { get } from "./apiManager";

const GetDataStoreList = async (actionResult) => {
    try {
        const response = await get(appConfig.APPID == eoeApp ? 'download/shopbyemp' : 'shop/byemployee');
        if (response.statusId == 200) {
            await SHOP_CONTROLLER.DeleteDataShop()
            await SHOP_CONTROLLER.InsertDataShop(response.data)
        }
        actionResult && await actionResult(response.data, null);
        return []
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataStoreList - ${error}`)
        return []
    }
}
const GetNearShop = async (latitude, longitude, srid, actionResult) => {
    try {
        const header = {
            latitude: latitude,
            longitude: longitude,
            srid: srid
        }
        const response = await get('shops/nearby', header);
        if (response.statusId == 200)
            actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : nearby - ${error}`)
        return []
    }
}
const GetDoing = async (actionResult) => {
    try {
        const response = await get('shops/doing');
        if (response.statusId == 200)
            actionResult && actionResult(response.data, null);
        return []
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : nearby - ${error}`)
        return []
    }
}
const GetDataSRID = async (actionResult) => {
    try {
        const response = await get('shops/srid');
        if (response.statusId == 200)
            actionResult && actionResult(response.data, null);
        return []
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : nearby - ${error}`)
        return []
    }
}
export const SHOP_API = { GetDataStoreList, GetNearShop, GetDoing, GetDataSRID }