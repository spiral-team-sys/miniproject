import { MENU_CONTROLLER } from "../controllers/MenuController";
import { get, getToken } from "./apiManager";

const GetDataMenu = async (actionResult) => {
    try {
        const response = await get('download/menulist');
        if (response.statusId == 200) {
            await MENU_CONTROLLER.DeleteDataMenu()
            await MENU_CONTROLLER.InsertDataMenu(response.data)
        }
        actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetDataMenu - ${error}`)
        return []
    }
}
const GetListDocument = async (actionResult) => {
    try {
        const response = await get('download/document');
        actionResult && actionResult(response.data, null);
        return response.data
    } catch (error) {
        actionResult && actionResult([], `Lỗi dữ liệu : GetListDocument - ${error}`)
        return []
    }
}
// Testing
const GetListDocumentType = async (docType) => {
    try {
        // const token = await Token()
        const requestInfo = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ3aW5hY2NvdW50bmFtZSI6IntcIkVtcGxveWVlSWRcIjozMzk4MSxcIlBhcmVudElkXCI6MzM5NzksXCJFbXBsb3llZUNvZGVcIjpcIk1FUi4xXCIsXCJFbXBsb3llZU5hbWVcIjpcIlRlc3QgTUVSXCIsXCJGaXNydE5hbWVcIjpcIk1FUlwiLFwiTGFzdE5hbWVcIjpcIlRlc3RcIixcIkFkZHJlc3NcIjpcIlwiLFwiQWNjb3VudElkXCI6MTksXCJUeXBlSWRcIjo1MDAsXCJHcm91cFR5cGVcIjpcIlNSXCIsXCJMb2dpbk5hbWVcIjpcIk1FUi4xXCIsXCJQYXNzd29yZFwiOlwiTnhhWG83cmo3REFoQlN2THdQWHQ0Zz09XCIsXCJFeHByaWVkRGF0ZVwiOjIwMjUxMTA5LFwiTWVudUxpc3RcIjpudWxsLFwiVG9rZW5cIjpudWxsLFwiSU1FSVwiOm51bGwsXCJEZXZpY2VUb2tlblwiOlwiZGJ6dFYyc2JORVVqa2ZGME0tMjhjcDpBUEE5MWJFUzhfQXRPVEdzSWlySEVwdmVvLUJuN20yOUNaa29scXBXcV9sX2VqTlBraDZaRTZHeXBhbklRRUIxMFEtbGxqYzB2Mjd2M2EwUXVUR1MtMVNLQkc2NHc1UXo2N3lldnlmc2I3VzhSR2tJY3l6TUhMd1h3U295cGZjY3M0eDhObHRJN2xia1wiLFwiU2VydmVyVGltZVwiOm51bGwsXCJDbGllbnRUaW1lXCI6bnVsbCxcIk1lbnVJdGVtXCI6bnVsbCxcIkRyb3BDYXRlZ29yeVwiOjEsXCJMb2NhdGlvblRyYWNraW5nXCI6MCxcIk5leHREYXRlUGFzc1dvcmRcIjoyMDI1MTEwOSxcIklzQ2hlY2tQcm9maWxlXCI6MCxcIlBob3RvXCI6XCIvdXBsb2FkZWQvYS5wbmdcIixcIklkXCI6MH0iLCJuYmYiOjE3NDA5NzQyNDgsImV4cCI6MTc0ODc1MDI0OCwiaWF0IjoxNzQwOTc0MjQ4fQ.YZBM_hFRl4oopeQLnSffrTS7t9YPimyPsEdG6yqHgsfwuy0q2Wy9vMOfbOhE9x9qTuv5I_OV0GL_Rbh39-hH-g',
                'docType': docType
            }
        }
        const response = await fetch('https://tvcp-api.sucbat.com.vn/' + 'document/documentbytype', requestInfo)
        const result = await response.json()

        if (result.statusId === 200) {
            return result?.data || []
        } else {
            alert(JSON.stringify(result))
        }
    } catch (e) {
        console.log(e, 'GetDocument')
    }
}
const GetListExam = async (shopId, actionResult) => {
    try {
        const requestInfo = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3aW5hY2NvdW50bmFtZSI6IntcIkVtcGxveWVlSWRcIjo0MzE3NTYsXCJQYXJlbnRJZFwiOjQzNDU1MixcIkVtcGxveWVlQ29kZVwiOlwiUzAyMC1QRzAxXCIsXCJFbXBsb3llZU5hbWVcIjpcIk5ndXnhu4VuIFRo4buLIFRow7p5IFTDrG5oXCIsXCJBZGRyZXNzXCI6bnVsbCxcIkVtYWlsXCI6bnVsbCxcIkFjY291bnRJZFwiOjEwMCxcIkFjY291bnRDb2RlXCI6bnVsbCxcIkFjY291bnROYW1lXCI6bnVsbCxcIlR5cGVJZFwiOjQ3LFwiTG9naW5OYW1lXCI6XCJ0ZXN0MDAxXCIsXCJQYXNzd29yZFwiOlwid3dOUXdNNWVIelZleUx4YTRXbWlpZz09XCIsXCJFeHByaWVkRGF0ZVwiOjIwMjUwMzA2LFwiTmV4dERhdGVQYXNzV29yZFwiOjIwMjQwMzI5LFwiV29ya2luZ0RhdGVcIjpudWxsLFwiTWVudUxpc3RcIjpudWxsLFwiVG9rZW5cIjpudWxsLFwiSU1FSVwiOm51bGwsXCJNb2JpbGVcIjpudWxsLFwiQ2l0eVwiOm51bGwsXCJEZXZpY2VUb2tlblwiOm51bGwsXCJJZGVudGl0eUNhcmROdW1iZXJcIjpudWxsLFwiSWRlbnRpdHlDYXJkRGF0ZVwiOm51bGwsXCJJZGVudGl0eUNhcmRCeVwiOm51bGwsXCJEZXB0TmFtZVwiOm51bGwsXCJMb2NhdGlvblwiOm51bGwsXCJCaXJ0aGRheVwiOm51bGwsXCJTZXJ2ZXJUaW1lXCI6bnVsbCxcIkNsaWVudFRpbWVcIjpudWxsLFwiUmV0dXJ0VVJMXCI6bnVsbCxcIkV4dGVybmFsTG9naW5zXCI6bnVsbCxcIkdyb3VwVHlwZVwiOlwiUEdcIixcIlNob3J0TmFtZVwiOlwiVMOsbmhcIixcIkltYWdlUHJvZmlsZVwiOlwiXCIsXCJHZW5kZXJcIjowLFwiSWRcIjowfSIsIm5iZiI6MTc0MTI0NjgyOCwiZXhwIjoxNzQ2NDMwODI4LCJpYXQiOjE3NDEyNDY4Mjh9.7nHsTxomEHp-WAeUbtj1m7MK0zKIceBRXa-BeZxPHKw',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'shopId': 0
            }
        }
        const response = await fetch(`https://sbc-api.sucbat.com.vn/exam/getlist/v2`, requestInfo)
        const result = await response.json()
        if (result.statusId == 200) {
            await actionResult(result.data, null)
        } else {
            await actionResult([], result.messager)
        }
    } catch (e) {
        await actionResult([], `Lỗi truy cập api: ${e}`)
    }
}
export const MENU_API = { GetDataMenu, GetListDocument, GetListDocumentType, GetListExam }