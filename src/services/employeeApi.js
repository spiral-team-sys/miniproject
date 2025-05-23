import { get, post } from './apiManager';

const GetInfomation = async (actionResult) => {
	try {
		const response = await get('employee/infomation');
		actionResult && actionResult(response.data, null);
	} catch (error) {
		actionResult && actionResult([], `Lỗi dữ liệu : GetInfomation - ${error}`);
	}
};
const ChangePassword = async (oldpass, newpass, actionResult) => {
	try {
		const response = await post('employee/changepass', {}, { oldpass, newpass });
		actionResult && actionResult(response);
	} catch (error) {
		actionResult && actionResult([], `Lỗi dữ liệu : ChangePassword - ${error}`);
	}
};
export const EMPLOYEE_API = { GetInfomation, ChangePassword };
