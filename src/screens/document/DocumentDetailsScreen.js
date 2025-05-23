import React, { useEffect, useState } from 'react'
import ItemDocument from '../../components/items/ItemDocument'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '../../components/GradientBackground'
import Header from '../../components/Header'
import { handlerGoBack, removeVietnameseTones } from '../../utils/helper'
import CustomListView from '../../components/lists/CustomListView'
import useTheme from '../../hooks/useTheme'
import { fontWeightBold } from '../../utils/utility'
import { deviceHeight } from '../../styles/styles'
import SearchData from '../../components/SearchData'
import OptionSortSheet from '../../components/bottomsheet/OptionSortSheet'
import { SheetManager } from 'react-native-actions-sheet'
import _ from 'lodash'
import { KEYs } from '../../utils/storageKeys'

const DocumentDetailScreen = ({ navigation, route }) => {
    const { appColors, styleDefault } = useTheme()
    const { itemDoc } = route.params
    const [data, setData] = useState([])
    const [dataMain, setDataMain] = useState([])
    const [search, _setSearch] = useState({ text: '', isSearch: false });

    const LoadData = async () => {
        await setData(JSON.parse(itemDoc.detailDocument))
        await setDataMain(JSON.parse(itemDoc.detailDocument))
    }
    const onSearch = (text) => {
        search.text = text
        search.isSearch = true
        const listSearch = _searchData(dataMain)
        setData(listSearch)
    }
    const _searchData = (filterList) => {
        const valueSearch = removeVietnameseTones(search.text).toLowerCase()
        const searchData = _.filter(filterList, (e) => (
            removeVietnameseTones(e.DocumentName || '').toLowerCase().match(valueSearch) ||
            removeVietnameseTones(e.Description || '').toLowerCase().match(valueSearch)
        ))
        return searchData
    }
    const onRightPress = async () => {
        await SheetManager.show(KEYs.ACTION_SHEET.OPTION_SHEET)
    }
    useEffect(() => {
        LoadData()
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.primaryColor },
        webview: { height: '100%', width: '100%' },
        contentWebview: { flex: 1, },
        nameDoc: { color: appColors.darkColor, fontSize: 15, fontWeight: fontWeightBold },
        desDoc: { color: appColors.darkColor, fontSize: 13, fontStyle: 'italic', opacity: 0.8 },
        textButonDoc: { fontSize: 13, color: appColors.primaryColor, fontWeight: 'bold' },
        dateDoc: { fontSize: 11, color: appColors.darkColor, fontStyle: 'italic', opacity: 0.8 },
        containListDoc: { flex: 1, padding: 12, borderRadius: 8, margin: 8, shadowColor: appColors.textColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: appColors.backgroundColor },
        mainListDoc: { flex: 1 },
        buttonClose: { position: 'absolute', top: deviceHeight / 25, right: 0, padding: 8 },
        containButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
    })

    const renderItem = ({ item, index }) => {
        return (
            <ItemDocument
                item={item}
                index={index}
                refCode={itemDoc.refCode}
            />
        )
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={`${itemDoc.groupName}`}
                onLeftPress={() => handlerGoBack(navigation)}
                onRightPress={onRightPress}
                iconNameRight={'filter'} />
            <View style={styleDefault.contentMain}>
                <SearchData
                    placeholder='Tìm kiếm'
                    value={search.text}
                    onSearchData={onSearch}
                />
                <CustomListView
                    renderItem={renderItem}
                    data={data}
                    extraData={data}
                />
            </View>
            <OptionSortSheet
                dataMain={dataMain}
                searchData={_searchData}
                callback={setData}
            />
        </SafeAreaView>
    )
}
export default DocumentDetailScreen