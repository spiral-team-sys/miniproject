import { get } from "./apiManager";
import { toastError } from "../utils/configToast";

const CheckVersion = async (params, actionResult) => {
    try {
        const response = await get('public/appver', params);
        actionResult && await actionResult(response);
        return actionResult
    } catch (error) {
        toastError('Lỗi API: CheckVersion', `${error}`)
        actionResult && actionResult({})
        return {}
    }
}
export const PUBLIC_API = { CheckVersion }