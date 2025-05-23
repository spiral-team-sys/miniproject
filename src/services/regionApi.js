
import { REGION_CONTROLLER } from "../controllers/RegionController";
import { get } from "./apiManager";

const GetDataProvince = async (actionResult) => {
    try {
        const response = await get('download/province');
        if (response.statusId == 200) {
            await REGION_CONTROLLER.DeleteDataProvince()
            await REGION_CONTROLLER.InsertDataProvince(response.data)
        }
        actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataMaster - ${error}`)
        return []
    }
};

//
export const REGION_API = { GetDataProvince }