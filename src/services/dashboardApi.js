import { toastError } from "../utils/configToast";
import { get } from "./apiManager";

const DashboardTop = async (actionResult) => {
    try {
        const response = await get('dashboard/top');
        if (response.statusId == 200) {
            actionResult && await actionResult(response.data);
        } else {
            toastError('Lỗi dữ liệu', response.messeger)
            actionResult([]);
        }
    } catch (error) {
        actionResult && actionResult([], `Lỗi api DashboardTop - ${error}`)
    }
}
const GetDashboardHome = async (actionResult) => {
    try {
        try {
            const response = await get('home/homedashboard');
            if (response.statusId == 200) {
                actionResult && await actionResult(response.data, response.messeger);
            }
            else {
                actionResult([], response.messeger);
            }
        } catch (error) {
            actionResult && actionResult([], `Lỗi api DashboardTop - ${error}`)
        }
    } catch (error) {
        actionResult && actionResult([], `Lỗi api GetDashboardHome - ${error}`)
    }
}

export const DASHBOARD_API = { DashboardTop, GetDashboardHome }