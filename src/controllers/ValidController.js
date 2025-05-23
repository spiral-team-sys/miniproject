import { isValidData, isValidField, isValidNumber, isValidObject } from '../utils/validateData'
import { KEYs } from '../utils/storageKeys'
import { calculateMinutesSince, convertToReadableString, formatNumber, messageAlert } from '../utils/helper'
import { Tables } from '../database/Tables'
import { Database } from '../database/Database'
import { InteractionManager } from 'react-native'
import { PHOTO_CONTROLLER } from './PhotoController'
import { TODAY } from '../utils/utility'
import appConfig, { eoeApp } from '../utils/appConfig/appConfig'
import _ from 'lodash'

// Valid Attendant
const attendanceWork = async (info, actionResult) => {
    const sql = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${info.shopId} AND photoDate=${info.auditDate} AND reportId=1`
    const { items } = await Database.executeSQL(sql)
    actionResult(isValidData(items))
}
const attendanceReport = async (info, actionResult) => {
    const configByShop = JSON.parse(info.shopInfo.config || '{}')
    // Kiểm tra chấm công
    let sql = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${info.shopInfo.shopId} AND photoDate=${info.shopInfo.auditDate} AND reportId=1`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        if (appConfig.APPID == eoeApp || ((info.shopInfo.record || 0) == 1 && !isValidField(configByShop.requiredAudioKTC))) {
            // Kiểm tra ghi âm
            sql = `SELECT * FROM ${Tables.audios.tableName} WHERE shopId=${info.shopInfo.shopId} AND audioDate=${info.shopInfo.auditDate}`
            const audio = await Database.executeSQL(sql)
            if (!isValidData(audio.items)) {
                actionResult(false, `Vui lòng thực hiện tối thiểu 1 File ghi âm trước khi hoàn thành báo cáo`)
                return
            }
        }
    } else {
        if (info.item.code == 'IN') {
            if ((info.shopInfo.isDoneReport || 0) == 1) {
                // Kiểm tra cửa hàng chưa hoàn thành 
                const itemShopNotDone = await shopDoneAttendance(info.shopInfo.shopId)
                if (isValidObject(itemShopNotDone)) {
                    actionResult(false, `Vui lòng hoàn thành cửa hàng ${itemShopNotDone.shopCode} - ${itemShopNotDone.shopName} (Ca ${itemShopNotDone.shiftName}) trước khi tiếp tục cửa hàng mới`)
                    return
                }
            }
        } else {
            actionResult(false, `Bạn chưa chấm công vào (CHECKIN), Vui lòng chấm công theo đúng trình tự`)
            return
        }
    }
    // Kiểm tra Mode KTC
    sql = `SELECT * FROM ${Tables.attendanceMode.tableName} WHERE shopId=${info.shopInfo.shopId} AND auditDate=${info.shopInfo.auditDate} AND mode='KTC'`
    const mode = await Database.executeSQL(sql)
    if (isValidData(mode.items)) {
        // Kiểm tra ghi chú lí do KTC
        const itemMode = mode.items[0] || []
        if (!isValidField(itemMode.reasonName)) {
            actionResult(false, `Bạn chưa chọn lí do "Không thành công"`)
            return
        }
        if (configByShop?.isNoteDetail || false) {
            if (!isValidField(itemMode.note)) {
                actionResult(false, `Bạn chưa nhập ghi chú chi tiết lí do ${itemMode.reasonName}`)
                return
            } else {
                if (itemMode.note.length < 10) {
                    actionResult(false, `Ghi chú chi tiết lí do ${itemMode.reasonName} tối thiểu 10 ký tự`)
                    return
                }
            }
        }
        // Kiểm tra ghi âm - KTC theo id config
        if (isValidField(configByShop.requiredAudioKTC)) {
            const idCheckAudio = configByShop.requiredAudioKTC.split(',').map(Number);
            const checkReasonId = _.filter(mode.items, (e) => idCheckAudio.includes(e.reasonId))
            if (checkReasonId.length > 0) {
                sql = `SELECT * FROM ${Tables.audios.tableName} WHERE shopId=${info.shopInfo.shopId} AND audioDate=${info.shopInfo.auditDate}`
                const audio = await Database.executeSQL(sql)
                if (!isValidData(audio.items)) {
                    actionResult(false, `Vui lòng thực hiện tối thiểu 1 File ghi âm lí do ${itemMode.reasonName} trước khi hoàn thành báo cáo`)
                    return
                }
            }
        }
    } else {
        // Kiểm tra theo config từ hệ thống
        const { minTime } = info.shopInfo
        if (isValidNumber(minTime) && info.item.code == 'OUT') {
            const checkTime = calculateMinutesSince(items[0].photoFullTime)
            if (checkTime < minTime) {
                actionResult(false, `Không được phép CHECKOUT, Vui lòng làm việc tại cửa hàng tối thiểu ${minTime} phút kể từ lúc chấm công`)
                return
            }
        }
        //
        if (isValidData(items)) {
            // Kiểm tra báo cáo 
            const result = await Valid_ReportKPI(info)
            actionResult(result.isValid, result.message)
            return
        }
    }
    //
    actionResult(true)
}
const attendanceDone = async (info, actionResult) => {
    const sql = `SELECT DISTINCT photoType, photoName FROM ${Tables.photos.tableName} WHERE shopId=${info.shopId} AND photoDate=${info.auditDate} AND reportId=1`
    const { items } = await Database.executeSQL(sql)
    let checked = { statusColor: 'errorColor', status: 0, statusName: 'Chưa làm' }
    if (isValidData(items)) {
        checked = {
            status: items.length,
            statusColor: items.length == 2 ? 'successColor' : items.length == 1 ? 'warningColor' : 'errorColor',
            statusName: items.length == 2 ? 'Hoàn thành' : items.length == 1 ? 'Đang thực hiện' : 'Chưa làm'
        }
    }
    actionResult && actionResult(checked)
    return checked
}
const shopDoneAttendance = async (shopId) => {
    const sql = `SELECT s.shopName,s.shopCode,s.shiftName,count(DISTINCT p.photoType) as count
        FROM ${Tables.storeList.tableName} AS s
        LEFT JOIN ${Tables.photos.tableName} AS p ON s.shopId=p.shopId AND s.auditDate=p.photoDate AND s.shiftCode=p.shiftCode
        WHERE p.reportId=1 
        AND p.photoDate=${TODAY.integer}
        AND s.shopId<>${shopId}
        GROUP BY s.shopId`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let index = 0; index < items.length; index++) {
            const photoInfo = items[index];
            if (photoInfo.count % 2 > 0)
                return photoInfo
        }
    }
    return {}
}
const Valid_ReportKPI = async (info) => {
    // Id không làm khảo sát cửa hàng
    const validShopFormatIds = [28, 43, 44, 53, 54];
    const sql = `SELECT m.id AS reportId,m.menuNameVN,r.isUploaded,r.isLocked
        FROM ${Tables.menuList.tableName} AS m 
        LEFT JOIN ${Tables.mobileRaw.tableName} AS r ON r.reportId=m.id AND shopId=${info.shopInfo.shopId} AND reportDate=${info.shopInfo.auditDate}
        WHERE m.byShop=1 AND m.id<>1
        ${validShopFormatIds.includes(info.shopInfo.shopFormatId) ? `AND m.id<>39` : ``}`
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        for (let index = 0; index < items.length; index++) {
            const e = items[index];
            if ((e.isLocked || 0) == 0) {
                return { isValid: false, message: `Chưa hoàn thành báo cáo ${e.menuNameVN}` }
            }
        }
        return { isValid: true }
    } else {
        return { isValid: false, message: 'Vui lòng hoàn thành tất cả các báo cáo trước khi CheckOut' }
    }
}
// Valid Audit Report
const auditReport = async (info, dataMain, actionResult) => {
    try {
        if (isValidData(dataMain)) {
            const validationPromises = [];
            for (let i = 0; i < dataMain.length; i++) {
                const e = dataMain[i];
                const _jsonData = JSON.parse(e.JsonData);
                switch (e.ItemCode) {
                    case 'FS':
                        validationPromises.push(Valid_FS(e, _jsonData));
                        break;
                    case 'NND&FS':
                        validationPromises.push(Valid_NNDFS(e, _jsonData));
                        break;
                    case 'NND&VISIBILITY':
                        validationPromises.push(Valid_NNDVISIBILITY(e, _jsonData));
                        break;
                    case 'VISIBILITY':
                        validationPromises.push(Valid_VISIBILITY(e, _jsonData));
                        break;
                    case 'VISIBILITYMT':
                        validationPromises.push(Valid_VISIBILITYMT(e, _jsonData));
                        break;
                    case 'PRICE':
                        validationPromises.push(Valid_PRICE(e, _jsonData));
                        break;
                    case 'PLANOGRAM':
                        validationPromises.push(Valid_PLANOGRAM(e, _jsonData));
                        break;
                    case 'SOF':
                        validationPromises.push(Valid_SHAREOFFEATURES(e, _jsonData));
                        break;
                    case 'POWERCLAIM':
                        validationPromises.push(Valid_POWERCLAIM(e, _jsonData));
                        break;
                    case 'PROMOTION':
                        validationPromises.push(Valid_PROMOTION(e, _jsonData));
                    default:
                        break;
                }
            }
            validationPromises.push(Valid_Photos(info, dataMain))
            const results = await Promise.all(validationPromises);
            // 
            InteractionManager.runAfterInteractions(() => {
                let strError = '';
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    if (!(result.isValid || false)) {
                        strError += `${result.message}\n`;
                    }
                }
                actionResult && actionResult(!(strError.length > 0), strError);
            })
        } else {
            actionResult && actionResult(false, `Chưa hoàn thành báo cáo chấm điểm`);
        }
    } catch (error) {
        actionResult && actionResult(false, error.message);
    }
};
const editAuditReport = async (info, dataMain, actionResult) => {
    try {
        if (isValidData(dataMain)) {
            const validationPromises = [];
            for (let i = 0; i < dataMain.length; i++) {
                const e = dataMain[i];
                const _jsonData = JSON.parse(e.JsonData);
                switch (e.ItemCode) {
                    case 'FS':
                        validationPromises.push(Valid_FS(e, _jsonData));
                        break;
                    case 'NND&FS':
                        validationPromises.push(Valid_NNDFS(e, _jsonData));
                        break;
                    case 'NND&VISIBILITY':
                        validationPromises.push(Valid_NNDVISIBILITY(e, _jsonData));
                        break;
                    case 'VISIBILITY':
                        validationPromises.push(Valid_VISIBILITY(e, _jsonData));
                        break;
                    case 'VISIBILITYMT':
                        validationPromises.push(Valid_VISIBILITYMT(e, _jsonData));
                        break;
                    case 'PRICE':
                        validationPromises.push(Valid_PRICE(e, _jsonData));
                        break;
                    case 'PLANOGRAM':
                        validationPromises.push(Valid_PLANOGRAM(e, _jsonData));
                        break;
                    case 'SOF':
                        validationPromises.push(Valid_SHAREOFFEATURES(e, _jsonData));
                        break;
                    case 'POWERCLAIM':
                        validationPromises.push(Valid_POWERCLAIM(e, _jsonData));
                        break;
                    default:
                        break;
                }
            }
            const results = await Promise.all(validationPromises);
            // 
            InteractionManager.runAfterInteractions(() => {
                let strError = '';
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    if (!(result.isValid || false)) {
                        strError += `${result.message}\n`;
                    }
                }
                actionResult && actionResult(!(strError.length > 0), strError);
            })
        } else {
            actionResult && actionResult(false, `Chưa hoàn thành báo cáo chấm điểm`);
        }
    } catch (error) {
        actionResult && actionResult(false, error.message);
    }
};
const Valid_FS = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        // OffShelf
        const _displayValue = e.DisplayValue == undefined ? null : e.DisplayValue
        if (e.isOffShelf == 1) {
            if (_displayValue == null)
                error += `- Vui lòng khảo sát ${e.ProductName}`
        } else {
            if ((e.isProductMainShelf == 1 || _displayValue == 1)) {
                const _hblValue = e.HBLValue == undefined ? null : e.HBLValue
                const _competitorValue = e.CompetitorValue == undefined ? null : e.CompetitorValue
                if (_hblValue == null || _competitorValue == null)
                    error += `- ${e.ProductName}\n`
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_NNDFS = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0) {
            error += `- ${e.ProductName}\n`
        } else {
            if (_value == 1) {
                if (e.isArea == 1) {
                    let errorArea = ''
                    const jsonArea = JSON.parse(e.JsonArea)
                    _.forEach(jsonArea, (i) => {
                        const _areaValue = i.QuantityValue == undefined ? null : i.QuantityValue
                        if (_areaValue == null) {
                            errorArea += `${i.ItemName}, `
                        }
                    })
                    if (errorArea !== null && errorArea.length > 0)
                        error += `Chưa nhập số lượng ${e.ProductName}: ${errorArea}\n`
                } else {
                    const _quantityValue = e.QuantityValue == undefined ? null : e.QuantityValue
                    if (_quantityValue == null)
                        error += `- ${e.ProductName}\n`
                }
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_NNDVISIBILITY = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0) {
            error += `- ${e.ProductName}\n`
        } else {
            if (_value == 1 && e.isPrice == 1) {
                const _priceValue = e.PriceValue == undefined ? null : e.PriceValue
                if (_priceValue == null)
                    error += `- Chưa nhập Giá ${e.ProductName}\n`
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_VISIBILITY = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0) {
            error += `- ${e.ItemName}\n`
        } else {
            if (_value == 0 && (e?.isReason || 0) == 1) {
                const dataReason = _.filter(JSON.parse(e.dataReason), (item) => item.isChoose)
                if (!isValidData(dataReason)) {
                    error += `- Chưa chọn lí do không của ${e.ItemName}\n`
                }
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_VISIBILITYMT = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0) {
            error += `- ${e.ItemName}\n`
        } else {
            if (_value == 0 && (e?.isReason || 0) == 1) {
                const dataReason = _.filter(JSON.parse(e.dataReason), (item) => item.isChoose)
                if (!isValidData(dataReason)) {
                    error += `- Chưa chọn lí do không của ${e.ItemName}\n`
                }
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_PRICE = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.PriceValue == undefined ? null : e.PriceValue
        if (_value == null || _value.length == 0)
            error += `- ${e.ProductName}\n`
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_PLANOGRAM = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        // Số HBL
        const _hblvalue = e.HBLValue == undefined ? null : e.HBLValue
        if (_hblvalue == null || _hblvalue.length < 0)
            error += `- Chưa nhập số HBL\n`

        // Số Tổng HBL + Competitor
        const _competitorvalue = e.CompetitorValue == undefined ? null : e.CompetitorValue
        if (_competitorvalue == null || _competitorvalue.length < 0)
            error += `- Chưa nhập Số HVN + Đối thủ\n`
        else if (parseInt(_competitorvalue) == 0)
            error += `- Số HVN + Đối thủ phải lớn hơn 0\n`

        // Thị phần đối thủ 
        if (parseInt(_competitorvalue || 0) < parseInt(_hblvalue || 0)) {
            error += `- Số lượng Tổng phải lớn hơn HVN`
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_SHAREOFFEATURES = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        // Số HBL
        const _hblvalue = e.HBLValue == undefined ? null : e.HBLValue
        if (_hblvalue == null || _hblvalue.length < 0)
            error += `- Chưa nhập số HBL\n`

        // Số Tổng số Cider/Bia
        const _competitorvalue = e.CompetitorValue == undefined ? null : e.CompetitorValue
        if (_competitorvalue == null || _competitorvalue.length < 0)
            error += `- Chưa nhập Tổng số Cider/Bia\n`

        // Thị phần đối thủ 
        if (parseInt(_competitorvalue || 0) < parseInt(_hblvalue || 0)) {
            error += `- Số lượng Tổng phải lớn hơn HVN`
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_POWERCLAIM = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0)
            error += `- ${e.ProductName}\n`
        else {
            if (_value == 1) {
                const dataPOSM = JSON.parse(e.JsonPOSM || '[]')
                const checkPOSMList = _.filter(dataPOSM, (e) => e.isChoose)
                if (!isValidData(checkPOSMList)) {
                    error += `- Chưa chọn POSM ${e.ProductName}\n`
                }
            }
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_PROMOTION = (itemMain, data) => {
    let error = ''
    _.forEach(data, (e) => {
        const _value = e.DisplayValue == undefined ? null : e.DisplayValue
        if (_value == null || _value.length == 0) {
            error += `- ${e.ItemName}\n`
        }
    })
    //
    if (error !== null && error.length > 0)
        return { isValid: false, message: `Chưa hoàn thành khảo sát "${itemMain.ItemName}"\n${error}` }
    else
        return { isValid: true }
}
const Valid_Photos = async (info, dataMain) => {
    const whereArgs = _.map(dataMain, 'ItemName');
    const whereClause = `(${whereArgs.map((e) => `'${e}'`).join(', ')})`;
    const sql = `SELECT photoType, COUNT(*) AS countPhoto
        FROM ${Tables.photos.tableName} 
        WHERE shopId=${info.shopInfo.shopId} 
        AND photoDate=${info.shopInfo.auditDate} 
        AND photoType IN ${whereClause}
        GROUP BY photoType
    `
    const { items } = await Database.executeSQL(sql)
    if (isValidData(items)) {
        const dataKPI = _.map(dataMain, (e) => e.ItemName)
        const dataPhoto = _.map(items, (e) => e.photoType)
        const invalidPhotos = dataKPI.filter(photo => !dataPhoto.includes(photo))
        if (isValidData(invalidPhotos)) {
            return { isValid: false, message: `Vui lòng chụp hình: ${invalidPhotos.join(', ')}` }
        }
    } else {
        return { isValid: false, message: `Vui lòng chụp hình các KPI trong báo cáo` }
    }
    // Tổng 10 tấm hình
    const totalPhoto = _.sumBy(items, 'countPhoto')
    if (totalPhoto < 10) {
        return { isValid: false, message: `Vui lòng chụp đủ 10 tấm hình cho tất cả báo cáo` }
    }
    return { isValid: true }
}
// Valid Survey Report
const surveyReport = async (dataSurvey = [], dataPhoto = [], info) => {
    let strError = "";
    let lstGroupMessage = [];
    if (isValidData(dataSurvey)) {
        // SurveyItem
        const dataGroup = _.unionBy(dataSurvey, "GroupName");
        for (let index = 0; index < dataGroup.length; index++) {
            let groupMessage = ''
            const groupInfo = dataGroup[index];
            const surveyList = _.filter(dataSurvey, (e) => e.GroupName == groupInfo.GroupName && e.Required == 1);
            // SurveyDetails
            for (let i = 0; i < surveyList.length; i++) {
                const item = surveyList[i];
                if (item.Required == 1) {
                    switch (item.ItemType) {
                        case KEYs.ANSWER_TYPE.TEXT:
                        case KEYs.ANSWER_TYPE.NUMBER:
                        case KEYs.ANSWER_TYPE.FLOAT:
                            if (!isValidField(item.AnswerValue)) {
                                groupMessage += `- Chưa trả lời câu hỏi ${item.ItemName}\n`;
                            } else {
                                if (item.AnswerValue !== "0") {
                                    if (isValidNumber(item.Min) && item.AnswerValue < item.Min) {
                                        groupMessage += `- ${item.ItemName} chỉ cho phép tối thiểu: ${formatNumber(item.Min, ",")} \n`;
                                    }
                                    if (isValidNumber(item.Max) && item.AnswerValue > item.Max) {
                                        groupMessage += `- ${item.ItemName} chỉ cho phép tối đa: ${formatNumber(item.Max, ",")} \n`;
                                    }
                                }
                            }
                            break;
                        case KEYs.ANSWER_TYPE.QUANTITY_PRICE:
                            if (!isValidField(item.AnswerValue)) {
                                groupMessage += `- Chưa nhập số lượng ${item.ItemName}\n`;
                            } else {
                                if (item.AnswerValue !== "0") {
                                    if (isValidField(item.AnswerValue2) && isValidNumber(item.Min)) {
                                        if (item.AnswerValue2 < item.Min) {
                                            groupMessage += `- Giá ${item.ItemName} chỉ được nhập nhỏ nhất : ${formatNumber(item.Min, ",")} VNĐ \n`;
                                        }
                                    } else {
                                        groupMessage += `- Bạn chưa nhập Giá ${item.ItemName}\n`;
                                    }
                                }
                            }
                            break;
                        case KEYs.ANSWER_TYPE.BOOLEAN:
                            if (isValidData(item.JsonAnswer)) {
                                const checkValue = _.filter(item.JsonAnswer, (e) => e.isChoose == true)
                                if (!isValidData(checkValue)) {
                                    groupMessage += `- Chưa trả lời câu hỏi ${item.ItemName}\n`;
                                } else {
                                    const isNoteValue = _.some(checkValue, (e) => e.isNote === 1)
                                    if (isNoteValue) {
                                        const checkAnswer = _.filter(checkValue, (e) => e.AnswerValue !== null)
                                        if (checkAnswer.length !== checkValue.length) {
                                            groupMessage += `- Vui lòng nhập câu trả lời đã chọn trong câu hỏi ${item.ItemName}\n\n`;
                                        }
                                    }
                                }
                            }
                            break;
                        case KEYs.ANSWER_TYPE.CHECKBOX:
                            if (isValidData(item.JsonAnswer)) {
                                const checkValue = _.filter(item.JsonAnswer, (e) => e.isChoose == true);
                                if (!checkValue.length > 0) {
                                    groupMessage += `- Chưa trả lời câu hỏi ${item.ItemName}\n`;
                                }
                            }
                            break;
                        case KEYs.ANSWER_TYPE.DATE:
                            if (!isValidField(item.AnswerValue)) {
                                groupMessage += `- Chưa trả lời câu hỏi ${item.ItemName}\n`;
                            }
                            break
                    }
                }
            }
            // 
            if (isValidField(groupMessage))
                lstGroupMessage.push({ groupName: groupInfo.GroupName, message: groupMessage });
        }
        // Kiểm tra giá trị theo GroupName (Nếu có TotalGroupValue)
        const groupValue = _.filter(dataGroup, (e) => isValidNumber(e.TotalGroupValue));
        if (isValidData(groupValue)) {
            for (let index = 0; index < groupValue.length; index++) {
                const item = groupValue[index];
                const surveyList = _.filter(dataSurvey, (e) => e.GroupName == item.GroupName);
                let totalValue = 0;
                for (let i = 0; i < surveyList.length; i++) {
                    const itemSurvey = surveyList[i];
                    totalValue += parseFloat(itemSurvey.AnswerValue || 0);
                }
                if (isValidNumber(item.TotalGroupValue) && totalValue !== item.TotalGroupValue) {
                    lstGroupMessage.push({ groupName: item.GroupName, message: `- Tổng giá trị phải bằng ${totalValue}/${formatNumber(item.TotalGroupValue, ",")} \n` });
                }
            }
        }
    }
    if (isValidData(dataPhoto)) {
        const messageErroPhoto = await VALID_CONTROLLER.photoReport(dataPhoto, info);
        if (isValidField(messageErroPhoto))
            lstGroupMessage.push({ groupName: 'Hình ảnh', message: messageErroPhoto });
    }
    // Result
    strError = convertToReadableString(lstGroupMessage, "groupName", "message");
    if (isValidField(strError)) {
        messageAlert("Chưa hoàn thành", strError);
        return false;
    } else {
        return true;
    }
};
// Valid Photo Report
const photoReport = async (dataPhoto = [], info) => {
    try {
        let strError = ''
        for (let index = 0; index < dataPhoto.length; index++) {
            const item = dataPhoto[index];
            const photoCapture = await PHOTO_CONTROLLER.GetDataPhotoByType(info.shopId, info.reportId, info.auditDate, item.ItemCode);
            if (photoCapture.length < item.Min) {
                strError += `- Vui lòng chụp tối thiểu ${item.Min} tấm: ${item.ItemName}\n`
            }
        }
        return strError;
    } catch (error) {
        console.log("photoReport", error);
    }
};
// Valid Photo - OVERVIEW
const photoOverview = async (shopInfo, actionResult) => {
    if (shopInfo.shopId) {
        let sqlPhoto = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${shopInfo.shopId} AND photoDate=${shopInfo.auditDate} AND photoType='OVERVIEW'`
        const { items } = await Database.executeSQL(sqlPhoto)
        actionResult && actionResult(isValidData(items))
        return isValidData(items)
    }
}
const photoSignBoard = async (shopInfo, actionResult) => {
    if (shopInfo.shopId) {
        let sqlPhoto = `SELECT * FROM ${Tables.photos.tableName} WHERE shopId=${shopInfo.shopId} AND photoDate=${shopInfo.auditDate} AND photoType='SIGNBOARD'`
        const { items } = await Database.executeSQL(sqlPhoto)
        actionResult && actionResult(isValidData(items))
        return isValidData(items)
    }
}
//
export const VALID_CONTROLLER = { attendanceReport, auditReport, editAuditReport, surveyReport, attendanceWork, photoOverview, attendanceDone, photoReport, photoSignBoard }