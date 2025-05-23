import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { CheckBox, Text } from "@rneui/base";
import _ from 'lodash';
import Header from "../../components/Header";
import { groupDataByKey, handlerGoBack } from "../../utils/helper";
import CustomListView from "../../components/lists/CustomListView";
import useTheme from "../../hooks/useTheme";
import { fontWeightBold, TODAY } from "../../utils/utility";
import { deviceHeight } from "../../styles/styles";
import GradientBackground from "../../components/GradientBackground";
import { MENU_API } from "../../services/menuApi";
import { toastError, toastSuccess } from "../../utils/configToast";
import { REPORT_API } from "../../services/reportApi";
import { isValidData } from "../../utils/validateData";

const FORMMODE = {
    NEW: "NEW",
    FAILD: "FAIL",
}
const QuickTestScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { menuReportInfo } = useSelector(state => state.menu)
    const { menuHomeInfo } = useSelector((state) => state.menu);
    const [dataExam, setDataExam] = useState([])
    const [isUploaded, setUploaded] = useState(false)
    const [formMode, setFormMode] = useState(FORMMODE.NEW);
    const [errorList, setErrorList] = useState(null)
    const [_mutate, setMutate] = useState(false)
    const [isLoading, setLoading] = useState(false)
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        const item = {
            shopId: 0,
            reportId: menuReportInfo.id,
            reportDate: TODAY
        }
        await REPORT_API.GetDataByShop(item, (mData, _mPhoto, _lastupdate, isUploaded, _isLocked, message) => {
            message && toastSuccess('Thông báo', message)
            setUploaded(isUploaded == 1)
            if (isValidData(mData)) {
                setDataExam(mData)
            } else {
                toastError('Thông báo', 'Dữ liệu câu hỏi khảo sát cửa hàng không có')
                handlerGoBack(navigation)
            }
        })
        await setLoading(false)
    }

    const uploadExam = async () => {
        const listQuest = _.unionBy(dataExam, 'questionId')
        let notSuccess = []
        listQuest.forEach(q => {
            const _check = _.filter(dataExam, (e) => e.questionId == q.questionId && (e.answer || false))
            if (_check.length == 0)
                notSuccess.push(q);
        })
        if (notSuccess !== null && notSuccess.length > 0) {
            SheetManager.show("error-exam", { payload: notSuccess })
            return false
        }
        // KIEM TRA KET QUA 
        const success = _.filter(dataExam, (e) => e.correct == !(e.answer || false))
        if (success.length > 0) {
            setFormMode(FORMMODE.FAILD)
            if (dataExam[0].examCount == 1) {
                toastError('Bài kiểm tra của bạn chưa đạt, vui lòng làm lại', 'Bài kiểm tra')
                return false
            } else {
                toastSuccess('Thông báo', "Đã gửi bài kiểm tra")
                handlerGoBack(navigation)
            }
        } else {
            let dataUpload = await _.map(dataExam, (i) => {
                return {
                    ExamId: i.examId,
                    QuestionId: i.questionId,
                    AnswerId: i.answerId,
                    Answer: i?.answer ? 1 : 0
                }
            })
            // await ExamAPI.UploadExam(shopinfo?.shopId || 0, dataUpload, async (result) => {
            //     if (result.statusId == 200) {
            //         ToastSuccess(result?.messager)
            //         await Exam.updateDone()
            //         await DeviceEventEmitter.emit('reload_task')
            //         await navigation.pop();
            //     } else {
            //         ToastError(result.messager || `Lỗi dữ liệu`)
            //     }
            // })
        }
    }
    // Handler
    const handlerUpload = async () => {
        if (formMode == FORMMODE.FAILD) {
            const resetData = _.map(dataExam, (e) => { return { ...e, answer: null } })
            setDataExam(resetData)
            setFormMode(FORMMODE.NEW)
        } else {
            await uploadExam()
        }
    }

    const handlerAnswerChange = (item) => {
        const _value = !(item.answer || false)
        item.answer = _value
        setMutate(e => !e)
    }

    //
    useEffect(() => {
        const _load = LoadData()
        return () => _load
    }, [])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
        itemMain: { width: '100%', backgroundColor: appColors.lightColor },
        itemMainError: { width: '100%', borderBottomWidth: 0.5, borderBottomColor: appColors.grayColor },
        titleQuestion: { width: '100%', fontSize: 14, fontWeight: fontWeightBold, color: appColors.primaryColor, padding: 8, fontStyle: 'italic' },
        titleQuestionError: { width: '100%', fontSize: 14, fontWeight: fontWeightBold, color: appColors.darkColor, padding: 8 },
        titleValue: { width: '90%', fontSize: 13, fontWeight: '500', color: appColors.darkColor },
        checkContainer: { borderWidth: 0, backgroundColor: 'transparent', margin: 0, marginVertical: 2, borderTopWidth: 0.5, borderTopColor: appColors.grayColor },
        contentExamError: { width: '100%', height: deviceHeight / 3 },
        titleErrorHead: { width: '100%', fontSize: 14, fontWeight: fontWeightBold, color: appColors.errorColor, textAlign: 'center', padding: 8 },
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            handlerAnswerChange(item)
        }
        const textColor = formMode == FORMMODE.FAILD && item.correct ? appColors.lightColor : appColors.darkColor
        const backgroundColor = formMode == FORMMODE.FAILD && item.correct ? appColors.primaryColor : 'transparent'
        const isChecked = item.answer || false
        const isDisible = item.locked == 1

        const marginTop = item.isParent ? 8 : 0
        const borderTopStartRadius = item.isParent ? 8 : 0
        const borderTopEndRadius = item.isParent ? 8 : 0
        return (
            <View key={`ebe-${index}`} style={{ ...styles.itemMain, marginTop, borderTopStartRadius, borderTopEndRadius }}>
                {item.isParent && <Text style={styles.titleQuestion}>{`${item.questionName}`}</Text>}
                <CheckBox
                    iconType="ionicon"
                    checkedIcon="checkbox"
                    uncheckedIcon="square-outline"
                    checkedColor={appColors.primaryColor}
                    //
                    title={item.answerName}
                    disabled={isDisible}
                    checked={isChecked}
                    textStyle={{ ...styles.titleValue, color: textColor }}
                    containerStyle={{ ...styles.checkContainer, backgroundColor: backgroundColor }}
                    onPress={onPress}
                />
            </View>
        )
    }
    const renderItemError = ({ item, index }) => {
        return (
            <View key={`iex-err${index}`} style={styles.itemMainError}>
                <Text style={styles.titleQuestionError}>{item.questionName}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={menuHomeInfo.menuNameVN}
                iconNameRight={isUploaded ? null : (formMode == FORMMODE.FAILD ? 'sync' : 'cloud-upload')}
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={isUploaded ? null : handlerUpload}
            />
            <View style={styleDefault.contentMain}>
                <CustomListView
                    data={dataExam}
                    extraData={dataExam}
                    renderItem={renderItem}
                />
            </View>
            <ActionSheet id="error-exam" headerAlwaysVisible onBeforeShow={setErrorList}>
                <View style={styles.contentExamError}>
                    <Text style={styles.titleErrorHead}>Bạn chưa trả lời hết các câu hỏi dưới đây</Text>
                    <CustomListView
                        data={errorList}
                        extraData={errorList}
                        renderItem={renderItemError}
                    />
                </View>
            </ActionSheet>
        </SafeAreaView>
    )
}
export default QuickTestScreen