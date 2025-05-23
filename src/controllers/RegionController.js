import { Database } from "../database/Database"
import { Tables } from "../database/Tables"

const InsertDataProvince = async (data) => {
    await Database.executeINSERT(Tables.provinceList, data)
}
const DeleteDataProvince = async () => {
    await Database.executeDELETE(Tables.provinceList)
}
//
export const REGION_CONTROLLER = { InsertDataProvince, DeleteDataProvince }