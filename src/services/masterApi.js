
import { MASTER_CONTROLLER } from "../controllers/MasterController";
import appConfig, { eoeApp } from "../utils/appConfig/appConfig";
import { get } from "./apiManager";

const GetDataMaster = async (actionResult) => {
    try {
        const response = await get(appConfig.APPID == eoeApp ? 'download/master' : 'download/masterlist');
        if (response.statusId == 200) {
            await MASTER_CONTROLLER.DeleteDataMaster()
            await MASTER_CONTROLLER.InsertDataMaster(response.data)
        }
        actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataMaster - ${error}`)
        return []
    }
};

// Data Bridgetone
const GetDataAxle = async (actionResult) => {
    try {
        const response = await get('download/axleconfig');
        if (response.statusId == 200) {
            await MASTER_CONTROLLER.DeleteDataMaster()
            await MASTER_CONTROLLER.InsertDataMaster(response.data)
        }
        actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataMaster - ${error}`)
        return []
    }
};

//
export const MASTER_API = { GetDataMaster, GetDataAxle }