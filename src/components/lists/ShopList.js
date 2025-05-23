import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "../../hooks/useTheme";
import { setShopInfo } from "../../redux/actions";
import CustomListView from "./CustomListView";
import ItemShop from "../items/ItemShop";
import { SHOP_CONTROLLER } from "../../controllers/ShopController";
import SearchData from "../SearchData";
import { removeVietnameseTones } from "../../utils/helper";
import GroupData from "../GroupData";
import { isValidData } from "../../utils/validateData";
import ShopInfoSheet from "../bottomsheet/ShopInfoSheet";
import Loading from "../Loading";
import _ from 'lodash';

const ShopList = ({ navigation, dataDefault, actionReload = false, onRefresh, onPress }) => {
    const { appColors, styleDefault } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [isLoading, setLoading] = useState(true)
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [search, _setItemSearch] = useState({ text: '', isSearch: false })
    const bottomSheetRef = useRef(null)
    const dispatch = useDispatch()
    let debounceTimeout;
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        if (isValidData(dataDefault)) {
            setData(dataDefault)
            setDataMain(dataDefault)
        } else {
            await SHOP_CONTROLLER.GetDataShop((shoplist) => {
                setData(shoplist)
                setDataMain(shoplist)
            })
        }
        await setLoading(false)
    }
    const handlerRefresh = async () => {
        onRefresh && await onRefresh()
        await LoadData()
    }
    // Handler
    const handlerPress = async (item) => {
        await dispatch(setShopInfo(item))
        if (onPress) {
            onPress(item)
        } else {
            if (bottomSheetRef.current && item.shopCode !== undefined)
                bottomSheetRef.current.snapToIndex(0)
        }
    }
    const handlerStartWork = () => {
        bottomSheetRef.current.close()
        navigation.navigate('Work')
    }
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const shoplist = _searchData(listChooseGroup)
        await setDataMain(listChooseGroup)
        await setData(shoplist)
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
            removeVietnameseTones(e.shopName).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.shopCode).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.address).toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.subSegment).toLowerCase().match(valueSearch)
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
    }, [actionReload, dataDefault])

    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderShopItem = ({ item, index }) => (
        <ItemShop
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
            <GroupData
                dataMain={dataMain}
                keyName='subSegment'
                keyValue='subSegment'
                handlerChange={handlerSearchByGroup}
            />
            <CustomListView
                data={data}
                extraData={data}
                renderItem={renderShopItem}
                onRefresh={handlerRefresh}
            />
            <ShopInfoSheet
                ref={bottomSheetRef}
                navigation={navigation}
                snapPointValue={['58%', '100%']}
                shopInfo={shopInfo}
                onStartWork={handlerStartWork}
            />
        </View>
    )
}

export default ShopList;