import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SearchData from "../../../../../components/SearchData";
import GroupData from "../../../../../components/GroupData";
import { removeVietnameseTones } from "../../../../../utils/helper";
import AuditProductsList from "../../../../../components/lists/AuditProductsList";
import useTheme from "../../../../../hooks/useTheme";
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import _ from 'lodash';

const EDIT_PowerClaimScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataMain, setDataMain] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const [indexGroup, _setIndexGroup] = useState({ groupId: 0, groupName: null })
    let debounceTimeout;
    //
    const LoadData = () => {
        const productList = _.filter(data, (e) => e.isChooseTag == 1)
        setDataMain(data)
        setDataProducts(productList)
    }
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataMain)
        setDataMain(dataUpdate || dataMain)
        callBackData(itemMain)
    }
    // Handler
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        indexGroup.groupId = item.keyValue
        indexGroup.groupName = item.keyName
        // 
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const productList = _searchData(listChooseGroup)
        // 
        await setDataMain(listChooseGroup)
        await setDataProducts(productList)
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMain)
            setDataProducts(listUpdate)
        }, 200)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        const searchData = _.filter(filterList, (e) => e.isChooseTag == 1 &&
            (
                removeVietnameseTones(e.ProductName).toLowerCase().match(valueSearch) ||
                removeVietnameseTones(e.ProductCode).toLowerCase().match(valueSearch) ||
                removeVietnameseTones(e.BrandName).toLowerCase().match(valueSearch)
            )
        )
        return searchData
    }
    const onNote = (text) => {
        itemMain.NoteKPIValue = text
        callBackData(itemMain)
    }
    //
    useEffect(() => {
        let isMoundted = true
        if (isMoundted)
            LoadData()
        return () => { isMoundted = false }
    }, [isRefreshData])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, marginTop: 8 }
    })
    if (isRefreshData) return <ActivityIndicator size='small' color={appColors.primaryColor} style={styleDefault.refreshView} />
    return (
        <View style={styles.mainContainer}>
            <SearchData
                placeholder='Tìm kiếm sản phẩm'
                value={search.text}
                onSearchData={onSearchData}
            />
            <FieldNoteKPI
                placeholder={`Ghi chú ${itemMain.ItemCode}`}
                value={itemMain.NoteKPIValue}
                onChangeData={onNote}
            />
            <GroupData
                dataMain={dataMain}
                keyName='BrandName'
                keyValue='BrandId'
                handlerChange={handlerSearchByGroup}
            />
            <AuditProductsList
                key='power-claim-screen'
                typeMain='POSM'
                isUploaded={isUploaded}
                data={dataProducts}
                dataMain={dataMain}
                itemMain={itemMain}
                itemShowImage={false}
                onSaveItem={handlerSaveItem}
            />
        </View>
    )
}
export default EDIT_PowerClaimScreen;