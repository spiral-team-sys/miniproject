import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import useTheme from "../../../../hooks/useTheme";
import GradientBackground from "../../../../components/GradientBackground";
import Header from "../../../../components/Header";
import CustomListView from "../../../../components/lists/CustomListView";
import { REPORT_API } from "../../../../services/reportApi";
import { toastError, toastSuccess } from "../../../../utils/configToast";
import { isValidData } from "../../../../utils/validateData";
import SurveyItems from "../../../../components/survey/SurveyItems";
import UploadWaiting from "../../../../components/UploadWaiting";
import Loading from "../../../../components/Loading";
import { REPORT_CONTROLLER } from "../../../../controllers/ReportController";
import { VALID_CONTROLLER } from "../../../../controllers/ValidController";
import { handlerGoBack } from "../../../../utils/helper";
import _ from 'lodash';

const EOE_SurveyReportScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme();
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const [isLoading, setLoading] = useState(true)
    const [isWaiting, setWaiting] = useState(false)
    const [dataSurvey, setDataSurvey] = useState([])
    const [isUploaded, setUploaded] = useState(false)
    const [lastUpdate, setLastUpdate] = useState('')
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            reportDate: shopInfo.auditDate
        }
        await REPORT_API.GetDataByShop(item, (mData, _mPhoto, _lastupdate, isUploaded, _isLocked, message) => {
            message && toastSuccess('Thông báo', message)
            setUploaded(isUploaded == 1)
            if (isValidData(mData)) {
                setDataSurvey(mData)
                setLastUpdate(_lastupdate)
            } else {
                toastError('Thông báo', 'Dữ liệu câu hỏi khảo sát cửa hàng không có')
                handlerGoBack(navigation)
            }
        })
        await setLoading(false)
    }
    const onUploadData = async () => {
        if (!isUploaded) {
            const valid = await VALID_CONTROLLER.surveyReport(dataSurvey)
            if (valid) {

                await setWaiting(true)
                const info = {
                    shopId: shopInfo.shopId,
                    auditDate: shopInfo.auditDate,
                    reportId: menuReportInfo.id
                }
                await REPORT_CONTROLLER.GetDataReportUpload(info, async (mData) => {
                    // Upload Report 
                    await REPORT_API.UploadDataReport(mData, async (result) => {
                        result.messeger && toastSuccess('Thông báo', result.messeger)
                        if (result.statusId == 200)
                            LoadData()
                        await setWaiting(false)
                    })
                })
            } else {
                await setWaiting(false)
            }
        }
    }
    // Handler  
    const onBack = () => {
        handlerGoBack(navigation)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => {
            isMounted = false
        }
    }, [])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        itemMain: { width: '100%', padding: 8 },
        contentMain: { flex: 1 }
    })
    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.itemMain}>
                <SurveyItems item={item} index={index} dataMain={dataSurvey} isUploaded={isUploaded == 1} />
            </View>
        )
    }
    if (isLoading) return <Loading isLoading={isLoading} color={appColors.primaryColor} />
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={menuReportInfo.menuNameVN || 'Bài kiểm tra'}
                subTitle={lastUpdate}
                iconNameRight={isUploaded ? 'cloud-done' : 'cloud-upload'}
                onLeftPress={onBack}
                onRightPress={onUploadData}
                disabledRight={isWaiting}
            />
            <UploadWaiting isWaiting={isWaiting} />
            {/* // Content Survey */}
            <View style={styleDefault.contentMain}>
                <CustomListView
                    data={dataSurvey}
                    extraData={dataSurvey}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    );
}

export default EOE_SurveyReportScreen;