import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { removeVietnameseTones } from "../../../../../utils/helper";
import GroupData from "../../../../../components/GroupData";
import AuditProductsList from "../../../../../components/lists/AuditProductsList";
import SearchData from "../../../../../components/SearchData";
import useTheme from "../../../../../hooks/useTheme";
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import _ from 'lodash';

const PriceScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataMain, setDataMain] = useState([])
    const [dataGroup, setDataGroup] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    let debounceTimeout
    //
    const LoadData = () => {
        setDataGroup(data)
        setDataMain(data)
        setDataProducts(data)
    }
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataMain)
        setDataMain(dataUpdate || dataMain)
        callBackData(itemMain)
    }
    // Handler
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const productList = _searchData(listChooseGroup)
        const groupData = _searchGroupData(listChooseGroup)
        // 
        await setDataGroup(groupData)
        await setDataMain(listChooseGroup)
        await setDataProducts(productList)
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMain)
            const listGroup = _searchGroupData(dataMain)
            setDataGroup(listGroup)
            setDataProducts(listUpdate)
        }, 200)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        let dataSearch = _.filter(filterList, (e) => e.isChooseTag == 1)
        if (dataSearch == null || dataSearch.length == 0) {
            dataSearch = filterList
        }
        const searchData = _.filter(dataSearch, (e) => (
            removeVietnameseTones(e.ProductName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.ProductCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.BrandName).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    const _searchGroupData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        const searchData = _.filter(filterList, (e) => (
            removeVietnameseTones(e.ProductName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.ProductCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.BrandName).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    const onNote = (text) => {
        itemMain.NoteKPIValue = text
        callBackData(itemMain)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [isRefreshData])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
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
                dataMain={dataGroup}
                keyName='BrandName'
                keyValue='BrandId'
                handlerChange={handlerSearchByGroup}
            />
            <AuditProductsList
                key='price-screen'
                typeMain='PRICE'
                isUploaded={isUploaded}
                data={dataProducts}
                dataMain={dataMain}
                itemMain={itemMain}
                onSaveItem={handlerSaveItem}
            />
        </View>
    )
}

export default PriceScreen;