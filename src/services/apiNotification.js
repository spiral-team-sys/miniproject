import { NOTIFICATION_CONTROLLER } from "../controllers/NotificationController";
import { get } from "./apiManager";

const getDataNotification = async (actionResult) => {
    try {
        const NotifyId = await NOTIFICATION_CONTROLLER.GetMaxId()
        const response = await get('notification/notifymaxId', { NotifyId });
        if (response.statusId == 200) {
            await NOTIFICATION_CONTROLLER.InsertDataNotification(response.data)
        }
        await NOTIFICATION_CONTROLLER.GetDataNotification((mData) => actionResult(mData, response.statusId !== 200 && response.messeger))
    } catch (error) {
        actionResult && actionResult([], `Lỗi api DataNotification - ${error}`)
    }
}
export const NOTIFICATION_API = { getDataNotification }