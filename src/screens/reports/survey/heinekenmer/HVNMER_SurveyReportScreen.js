import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import useTheme from "../../../../hooks/useTheme";
import { handlerGoBack, messageConfirm, removeVietnameseTones } from "../../../../utils/helper";
import Header from "../../../../components/Header";
import { REPORT_API } from "../../../../services/reportApi";
import { Image, Text } from "@rneui/themed";
import { deviceHeight, deviceWidth } from "../../../../styles/styles";
import { BottomTabReport } from "../../../../components/bottomsheet/BottomTabReport";
import GradientBackground from "../../../../components/GradientBackground";
import { REPORT_CONTROLLER } from "../../../../controllers/ReportController";
import CapturePhotoList from "../../../../components/lists/CapturePhotoList";
import { VALID_CONTROLLER } from "../../../../controllers/ValidController";
import SurveyItems from "../../../../components/survey/SurveyItems";
import CustomTab from "../../../../components/CustomTab";
import CustomListView from "../../../../components/lists/CustomListView";
import { isValidField, isValidObject } from "../../../../utils/validateData";
import Loading from "../../../../components/Loading";
import UploadWaiting from "../../../../components/UploadWaiting";
import { toastSuccess } from "../../../../utils/configToast";
import SearchData from "../../../../components/SearchData";
import { fontWeightBold } from "../../../../utils/utility";
import _ from 'lodash';

const HVNMER_SurveyReportScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme();
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const [pageConfig, setPageConfig] = useState({ "pageMain": { "INPUT": 1 } })
    const [isLoading, setLoading] = useState(true)
    const [dataMainSurvey, setDataMainSurvey] = useState([])
    const [dataSurvey, setDataSurvey] = useState([])
    const [lastUpdate, setLastUpdate] = useState('')
    const [isUploaded, setIsUploaded] = useState(false)
    const [tabGroup, setTabGroup] = useState([])
    const [dataPhoto, setDataPhoto] = useState([])
    const [isWaiting, setWaiting] = useState(false)
    const [isQuestion, setIsQuestion] = useState(1)

    const LoadData = async () => {
        !isLoading && await setLoading(true)
        const item = {
            shopId: shopInfo.shopId,
            reportId: menuReportInfo.id,
            reportDate: shopInfo.auditDate
        }
        await REPORT_API.GetDataByShop(item, async (mData, _mPhoto, lastupdate, isUploaded) => {
            const survey = _.filter(mData, (e) => e.ItemGroup == 'Survey')
            const photo = _.filter(mData, (e) => e.ItemGroup == 'Photo')
            const tabSurvey = _.uniqBy(survey, 'GroupName')
            setDataMainSurvey(survey)
            setDataSurvey(survey)
            setTabGroup(tabSurvey)
            setDataPhoto(photo)
            setLastUpdate(lastupdate)
            setIsUploaded(isUploaded == 1)
        })
        setPageConfig(JSON.parse(menuReportInfo.reportItem || '{}'))
        //
        await setLoading(false)
    }
    const UploadData = async () => {
        if (!isUploaded) {
            const info = {
                shopId: shopInfo.shopId,
                auditDate: shopInfo.auditDate,
                reportId: menuReportInfo.id,
            };
            const validSurvey = await VALID_CONTROLLER.surveyReport(dataMainSurvey, dataPhoto, info);
            if (!validSurvey)
                return
            //
            await setWaiting(true);
            await REPORT_CONTROLLER.GetDataReportUpload(info, async (mData) => {
                // Upload Report
                await REPORT_API.UploadDataReport(mData, async (result) => {
                    result.messeger && toastSuccess('Thông báo', result.messeger);
                    if (result.statusId === 200)
                        LoadData();
                    await setWaiting(false);
                });
            });
        } else {
            toastSuccess('Thông báo', 'Bạn đã hoàn thành báo cáo')
        }
    }
    const handlerSaveData = (dataUpdate) => {
        const dataResult = _.concat(dataUpdate, dataPhoto)
        REPORT_CONTROLLER.UpdateDataRaw(shopInfo.shopId, menuReportInfo.id, shopInfo.auditDate, dataResult)
    }
    const handlerDefaultData = (item) => {
        const options = [
            { text: "Hủy" },
            { text: "Có", onPress: () => onSetDefaultData(item, 'Có') },
            { text: "Không", onPress: () => onSetDefaultData(item, 'Không') }
        ]
        messageConfirm('Thông báo', `Bạn muốn chọn tất cả dữ liệu của ${item.GroupName} không ?`, options)
    }
    const onSetDefaultData = (item, value) => {
        const dataUpdate = _.map(dataMainSurvey, (e) => {
            if (e.GroupName == item.GroupName) {
                // Choose in Json
                if (e.ItemType == 'B' || e.ItemType == 'C') {
                    const jsonUpdate = _.map(e.JsonAnswer, (a) => {
                        if (a.ItemName == value) {
                            return { ...a, isChoose: true }
                        } else {
                            return { ...a, isChoose: false }
                        }
                    })
                    return { ...e, JsonAnswer: jsonUpdate }
                } else {
                    return { ...e, AnswerValue: value }
                }
            } else {
                return e
            }
        })
        handlerSaveData(dataUpdate)
        setDataMainSurvey(dataUpdate)
        setDataSurvey(dataUpdate)
    }
    const onSearchData = (text) => {
        search.text = text
        const listUpdate = _searchData(dataMainSurvey)
        setDataSurvey(listUpdate)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        const searchData = _.filter(filterList, (e) => (
            removeVietnameseTones(e.ItemName).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    const onBack = () => {
        handlerGoBack(navigation)
    }
    //
    useEffect(() => {
        LoadData()
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, borderTopLeftRadius: 30, backgroundColor: appColors.light, margin: 0, borderWidth: 0, borderTopRightRadius: 30, width: deviceWidth, overflow: 'hidden' },
        itemMain: { flex: 1, flexWrap: 'wrap' },
        itemContainer: { width: '98%', borderRadius: 5, alignSelf: 'center', margin: 3, backgroundColor: appColors.lightColor },
        headerItem: { width: '100%', fontSize: 16, fontWeight: '700', color: appColors.highlightColor, padding: 5, paddingStart: 8 },
        titleItem: { width: '100%', fontSize: 14, fontWeight: '600', color: appColors.darkColor, padding: 8, fontStyle: 'italic', minHeight: 56 },
        titleItem2: { width: '100%', fontSize: 14, fontWeight: '600', color: appColors.darkColor, padding: 8, fontStyle: 'italic' },
        titleButton: { fontSize: 16, color: appColors.darkColor, padding: 8, textAlign: 'center' },
        contentItem: { width: '100%', fontSize: 14, color: appColors.darkColor, marginStart: 32, fontStyle: "italic", fontWeight: '600' },
        btnUploadView: { width: '80%', alignItems: 'center', alignSelf: 'center', backgroundColor: appColors.linkColor, padding: 8, borderRadius: 20, position: 'absolute', bottom: deviceHeight / 10 },
        mainAudio: { flex: 0.1, backgroundColor: appColors.cardColor, padding: 8 },
        contentItemTab: { flex: 1, backgroundColor: appColors.cardColor, marginTop: 0, paddingStart: 5, paddingEnd: 5 },
        imageStyle: { width: '100%', height: 120, padding: 8, alignItems: 'center' },
        buttonSetDefaultData: { padding: 8, paddingTop: 0 },
        titleDefaultData: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.errorColor, textAlign: 'right' }
    })
    const renderItem = ({ item, index }) => {
        return (
            <View key={`index_ite_${index}`} style={styles.itemMain}>
                <View style={styles.itemContainer}>
                    {isValidField(item.ImageRoot) &&
                        <View style={styles.imageStyle}>
                            <Image
                                style={{ width: 120, height: 120 }}
                                source={{ uri: item.ImageRoot || '' }}
                                placeholderStyle={{ backgroundColor: 'transparent' }}
                                resizeMode='contain'
                                resizeMethod="resize"
                                PlaceholderContent={<ActivityIndicator size='small' color={appColors.primaryColor} />}
                            />
                        </View>
                    }
                    <SurveyItems
                        item={item}
                        index={index}
                        dataMain={dataMainSurvey}
                        isUploaded={isUploaded}
                        onChangeData={handlerSaveData}
                    />
                </View>
            </View>
        )
    }
    const renderItemTab = (item, index) => {
        const onSetDefault = () => handlerDefaultData(item)
        const surveyItems = dataSurvey.filter(e => e.GroupName == item.GroupName).sort((a, b) => a.rn - b.rn)
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentItemTab}>
                <SearchData
                    value={search.text}
                    placeholder={`Tìm kiếm dữ liệu ${item.GroupName}`}
                    onSearchData={onSearchData}
                />
                {item.isDefaultData == 1 &&
                    <TouchableOpacity onPress={onSetDefault} style={styles.buttonSetDefaultData}>
                        <Text style={styles.titleDefaultData}>{`Chọn tất cả dữ liệu ${item.GroupName}`}</Text>
                    </TouchableOpacity>
                }
                <CustomListView
                    data={surveyItems}
                    extraData={surveyItems}
                    renderItem={renderItem}
                    numColumns={2}
                />
            </KeyboardAvoidingView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GradientBackground />
            <Header
                title={menuReportInfo.menuNameVN || 'Khảo sát'}
                subTitle={`Cập nhật lúc ${lastUpdate || 'none-update'}`}
                iconNameRight={isUploaded ? 'cloud-done' : 'cloud-upload'}
                onLeftPress={onBack}
                onRightPress={UploadData}
                disabledRight={isWaiting}
            />
            <View style={styleDefault.contentMain}>
                <UploadWaiting isWaiting={isWaiting} title='Đang gửi dữ liệu lên hệ thống' />
                <Loading isLoading={isLoading} color={appColors.primaryColor} />
                {isQuestion == 1 ?
                    <CustomTab
                        data={tabGroup}
                        keyTabName='GroupName'
                        appColors={appColors}
                        renderItem={renderItemTab}
                    />
                    :
                    <CapturePhotoList navigation={navigation} data={dataPhoto} status={isUploaded ? 1 : 0} />
                }
            </View>
            {isValidObject(pageConfig?.pageMain) &&
                <BottomTabReport
                    config={pageConfig?.pageMain}
                    handlerChangePage={setIsQuestion}
                />
            }
        </SafeAreaView>
    )
}
export default HVNMER_SurveyReportScreen;
