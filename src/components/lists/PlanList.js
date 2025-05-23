import React, { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import CustomListView from "./CustomListView";
import ItemPlan from "../items/ItemPlan";
import SearchData from "../SearchData";
import { removeVietnameseTones } from "../../utils/helper";
import _ from 'lodash';

const PlanList = ({ dataMain = [] }) => {
    const { appColors } = useTheme()
    const [dataPlan, setDataPlan] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const ref = useRef()
    let debounceTimeout
    //
    const LoadData = () => {
        try {
            search.text = ''
            search.isSearch = false
            setDataPlan(dataMain)
            ref?.current?.scrollToIndex({ index: 0, animated: true })
        } catch (e) {
            console.log('Lỗi dữ liệu: ', e);
        }
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMain)
            setDataPlan(listUpdate)
        }, 100)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        // 
        const searchData = _.filter(filterList, (e) => (
            removeVietnameseTones(e.shopName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.shopCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.address).toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => isMounted = false
    }, [dataMain])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor }
    })
    const renderItem = ({ item, index }) => { return <ItemPlan item={item} index={index} /> }
    return (
        <View style={styles.mainContainer}>
            <SearchData
                placeholder={`Tìm kiếm ${dataMain.length} cửa hàng`}
                value={search.text}
                onSearchData={onSearchData}
            />
            <CustomListView
                ref={ref}
                data={dataPlan}
                extraData={dataPlan}
                renderItem={renderItem}
            />
        </View>
    )
}

export default PlanList;