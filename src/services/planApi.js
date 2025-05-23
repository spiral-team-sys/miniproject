import { toastError, toastSuccess } from "../utils/configToast";
import { get, post } from "./apiManager";

const GetDataCalendar = async (actionResult) => {
    try {
        const response = await get('plan/calendar');
        if (response == undefined)
            toastError('Lỗi API: GetDataCalendar', 'Quá trình lấy hiện tại đang không thực hiện được, vui lòng thử lại sau')
        else
            actionResult && await actionResult(response.data);
        return []
    } catch (error) {
        toastError('Lỗi API: GetDataCalendar', `${error}`)
        actionResult && actionResult([])
        return []
    }
}
const GetDataPlanByDay = async (workingDay, actionResult) => {
    try {
        const response = await get('plan/byday', { workingDay });
        if (response == undefined)
            toastError('Lỗi API: GetDataCalendar', 'Quá trình lấy hiện tại đang không thực hiện được, vui lòng thử lại sau')
        else
            actionResult && await actionResult(response.data);
        return []
    } catch (error) {
        toastError('Lỗi API: GetDataPlanByDay', `${error}`)
        actionResult && actionResult([])
        return []
    }
}
const UpdateDataPlan = async (typePlan, dataPlan, actionResult) => {
    try {
        const response = await post('plan/updateplan', JSON.stringify(JSON.stringify(dataPlan)), { typePlan });
        toastSuccess('Thông báo', response.messeger)
        actionResult && actionResult()
    } catch (e) {
        toastError('Lỗi gửi dữ liệu', `${e}`)
    }
}

export const PLAN_API = { GetDataCalendar, GetDataPlanByDay, UpdateDataPlan }