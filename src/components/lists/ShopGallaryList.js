import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import useTheme from "../../hooks/useTheme";
import { clearMenuReport, setShopInfo } from "../../redux/actions";
import CustomListView from "./CustomListView";
import { SHOP_CONTROLLER } from "../../controllers/ShopController";
import SearchData from "../SearchData";
import { removeVietnameseTones } from "../../utils/helper";
import { isValidData } from "../../utils/validateData";
import Loading from "../Loading";
import ItemShopGallary from "../items/ItemShopGallary";
import _ from 'lodash';

const ShopGallaryList = ({ onShowDetails }) => {
    const { appColors, styleDefault } = useTheme()
    const [isLoading, setLoading] = useState(true)
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const dispatch = useDispatch()
    let debounceTimeout;
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        await SHOP_CONTROLLER.GetDataShopGallary((shoplist) => {
            setData(shoplist)
            setDataMain(shoplist)
        })
        await setLoading(false)
    }
    // Handler
    const handlerPress = async (item) => {
        await dispatch(setShopInfo(item))
        onShowDetails && onShowDetails(item)
    }
    const onSearchData = (text) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            search.text = text
            const listUpdate = _searchData(dataMain)
            setData(listUpdate)
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
            removeVietnameseTones(e.shopName || '').toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.shopCode || '').toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.address || '').toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData();
        return () => { isMounted = false }
    }, [])

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderShopItem = ({ item, index }) => (
        <ItemShopGallary
            item={item}
            index={index}
            appColors={appColors}
            styleDefault={styleDefault}
            onPress={handlerPress} />
    )
    if (isLoading) return <Loading isLoading={isLoading} color={appColors.primaryColor} />
    return (
        <View style={styles.mainContainer}>
            <SearchData
                placeholder='Tìm kiếm cửa hàng'
                value={search.text}
                onSearchData={onSearchData}
            />
            <CustomListView
                data={data}
                extraData={data}
                renderItem={renderShopItem}
                onRefresh={LoadData}
            />
        </View>
    )
}
export default ShopGallaryList;