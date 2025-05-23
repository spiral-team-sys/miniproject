import React, { useEffect, useState } from "react";
import useTheme from "../../../../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../../../components/GradientBackground";
import Header from "../../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { handlerGoBack, removeVietnameseTones } from "../../../../utils/helper";
import { clearMenuHome, setShopInfo } from "../../../../redux/actions";
import { REPORT_API } from "../../../../services/reportApi";
import CalendarView from "../../../../components/calendar/CalendarView";
import GroupData from "../../../../components/GroupData";
import CustomListView from "../../../../components/lists/CustomListView";
import { fontWeightBold } from "../../../../utils/utility";
import { Text } from "@rneui/themed";
import moment from "moment";
import _ from 'lodash';
import { isValidData } from "../../../../utils/validateData";
import Loading from "../../../../components/Loading";
import SearchData from "../../../../components/SearchData";

const SummaryAuditScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const { menuReportInfo, menuHomeInfo } = useSelector(state => state.menu)
    const [isLoading, setLoading] = useState(true)
    const [dataPlan, setDataPlan] = useState([])
    const [dataMainDetail, setDataMainDetail] = useState([])
    const [dataDetail, setDataDetail] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const dispatch = useDispatch()
    let debounceTimeout;
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        await REPORT_API.GetDataAuditUpdate((mData, message) => {
            message && toastError('Thông báo', message)
            const todayData = mData.flatMap((week) => {
                const days = JSON.parse(week.jsonWeek);
                return days.filter((day) => day.isToday === 1);
            });
            if (isValidData(todayData)) {
                setDataMainDetail(todayData[0].JsonData)
                setDataDetail(todayData[0].JsonData)
            }
            setDataPlan(mData)
        })
        await setLoading(false)
    }
    // Handler 
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        const listChooseGroup = _.map(dataMainDetail, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const dataDetailList = _searchData(listChooseGroup)
        await setDataMainDetail(listChooseGroup)
        await setDataDetail(dataDetailList)
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMainDetail)
            setDataDetail(listUpdate)
        }, 100)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        //
        let dataChooseTag = _.filter(filterList, (e) => e.isChooseTag == 1)
        if (!isValidData(dataChooseTag))
            dataChooseTag = filterList
        //
        const searchData = _.filter(dataChooseTag, (e) => (
            removeVietnameseTones(e.ShopName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.ShopCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.Address).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.QCStatus).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    const handlerChooseDay = (item) => {
        setDataMainDetail(item.JsonData)
        setDataDetail(item.JsonData)
    }
    const handlerShowDetail = (item) => {
        const itemUpdate = {
            shopId: item.ShopId,
            auditDate: item.AuditDate,
            shopName: item.ShopName,
            auditId: item.AuditId
        }
        dispatch(setShopInfo(itemUpdate))
        navigation.navigate('AuditReportEdit')
    }
    const onBack = () => {
        dispatch(clearMenuHome())
        handlerGoBack(navigation)
    }
    //
    useEffect(() => {
        const _load = LoadData()
        return () => _load
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        contentMain: { flex: 1 },
        contentShopList: { width: '100%', height: '90%', paddingHorizontal: 8 },
        itemShopMain: { width: '100%', padding: 8, backgroundColor: appColors.backgroundColor, borderWidth: 1, borderStartWidth: 5, borderColor: appColors.borderColor, marginBottom: 8, borderRadius: 8 },
        titleShop: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor },
        subTitleShop: { fontSize: 12, fontWeight: '500', color: appColors.subTextColor },
        subTimeShop: { fontSize: 11, fontWeight: '500', color: appColors.subTextColor, fontStyle: 'italic', textAlign: 'right', position: 'absolute', bottom: 8, end: 8 },
    })
    const renderItemShop = ({ item, index }) => {
        const onPress = () => { handlerShowDetail(item) }
        return (
            <TouchableOpacity key={index} style={{ ...styles.itemShopMain, borderStartColor: appColors[item.ColorStatus] }} onPress={onPress}>
                <Text style={styles.titleShop}>{`${index + 1}. ${item.ShopName}`}</Text>
                <Text style={styles.subTitleShop}>{`ĐC: ${item.Address}`}</Text>
                <Text style={styles.subTitleShop}>{`Trạng thái: ${item.QCStatus}`}</Text>
                <Text style={styles.subTimeShop}>{moment(item.AuditTime).format('HH:mm:ss')}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={menuHomeInfo?.menuNameVN || menuReportInfo.menuNameVN}
                onLeftPress={onBack}
                iconNameRight='sync'
                onRightPress={LoadData}
            />
            <Loading isLoading={isLoading} color={appColors.primaryColor} />
            <View style={styleDefault.contentMain}>
                <CalendarView
                    data={dataPlan}
                    onChooseDay={handlerChooseDay}
                />
                <View style={styles.contentShopList}>
                    <SearchData
                        placeholder='Tìm kiếm cửa hàng'
                        value={search.text}
                        onSearchData={onSearchData}
                    />
                    <GroupData
                        dataMain={dataMainDetail}
                        keyName="QCStatus"
                        keyValue="QCStatus"
                        handlerChange={handlerSearchByGroup}
                    />
                    <CustomListView
                        data={dataDetail}
                        renderItem={renderItemShop}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default SummaryAuditScreen;