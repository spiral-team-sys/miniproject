import React, { useEffect, useRef, useState } from "react";
import useTheme from "../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import appConfig from "../utils/appConfig/appConfig";
import { Icon, Text } from "@rneui/themed";
import CustomListView from "./lists/CustomListView";
import _ from 'lodash';

const GroupData = ({ dataMain, keyValue, keyName, sumValueName, handlerChange, handlerCloseTag, isMultiple = false }) => {
    const { appColors } = useTheme()
    const [dataGroup, setDataGroup] = useState([])
    const [isCloseTag, setCloseTag] = useState(false)
    const refList = useRef()
    //
    const LoadData = () => {
        if (dataMain !== null && dataMain.length > 0) {
            const _dataGroup = _.uniqBy(dataMain, keyValue)
            const _isCloseTag = _.filter(_dataGroup, (e) => e.isChooseTag == 1)
            setCloseTag(_isCloseTag !== null && _isCloseTag.length > 0)
            setDataGroup(_dataGroup)
        }
    }
    // Handler
    const onItemPress = (item, index) => {
        if (dataMain !== null && dataMain.length > 0) {
            refList.current.scrollToIndex({ index: index, animated: true })
            const _item = {
                keyValue: item[keyValue],
                keyName: item[keyName]
            }
            handlerChange && handlerChange(_item, keyValue, isMultiple)
        }
    }
    const onCloseTag = () => {
        if (dataMain !== null && dataMain.length > 0) {
            refList.current.scrollToIndex({ index: 0, animated: true })
            handlerCloseTag()
        }
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [dataMain])

    // View
    const styles = StyleSheet.create({
        mainContainer: { width: '100%', paddingBottom: 8 },
        itemMain: { minWidth: 80, margin: 8, borderWidth: 1, borderColor: appColors.primaryColor, borderRadius: 20, backgroundColor: appColors.primaryColor, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
        titleView: { paddingHorizontal: 8, paddingEnd: 16, fontSize: 13, fontWeight: Platform.OS == 'ios' ? '600' : '700', color: appColors.lightColor, textAlign: 'center' },
        viewSumValue: { borderWidth: 1.5, backgroundColor: appColors.lightColor, borderColor: appColors.primaryColor, borderRadius: 20, minWidth: 30, minHeight: 30, alignItems: 'center', justifyContent: 'center' },
        titleSumValue: { fontSize: 12, fontWeight: 'bold', color: appColors.darkColor },
        viewGroupTag: { width: '100%', minHeight: 42, flexDirection: 'row', alignItems: 'center' },
        viewCloseTag: { backgroundColor: appColors.primaryColor, minWidth: 30, minHeight: 30, borderRadius: 50, justifyContent: 'center', marginHorizontal: 8 }
    })
    const renderItem = ({ item, index }) => {
        const pressItem = () => {
            onItemPress(item, index)
        }
        const sumByTag = _.filter(dataMain, e => e[keyValue] == item[keyValue])
        const colorValue = item.isChooseTag == 1 ? appColors.darkColor : appColors.lightColor
        const colorText = item.isChooseTag == 1 ? appColors.lightColor : appColors.darkColor
        const bgColorView = item.isChooseTag == 1 ? appColors.lightColor : appColors.primaryColor
        const borderColorView = item.isChooseTag == 1 ? appColors.primaryColor : appColors.lightColor
        const styleDefault = {
            ...styles.itemMain,
            marginEnd: (index + 1) == dataGroup.length ? 8 : 0,
            backgroundColor: borderColorView
        }
        return (
            <TouchableOpacity key={`igi_${index}`} style={styleDefault} onPress={pressItem}>
                <View style={{ ...styles.viewSumValue, backgroundColor: bgColorView, borderColor: borderColorView }}>
                    <Text style={{ ...styles.titleSumValue, color: colorValue, paddingHorizontal: sumByTag.length > 10 ? 8 : 0 }}>
                        {sumValueName ? item[sumValueName] : sumByTag.length}
                    </Text>
                </View>
                <Text style={{ ...styles.titleView, color: colorText }}>{item[keyName] || ''}</Text>
            </TouchableOpacity>
        )
    }
    if (dataMain == null || dataMain.length == 0) return <View />
    return (
        <View style={styles.mainContainer}>
            <View style={styles.viewGroupTag}>
                {isMultiple && isCloseTag &&
                    <TouchableOpacity style={styles.viewCloseTag} onPress={onCloseTag}>
                        <Icon type={appConfig.ICON_TYPE} name="close" size={18} color={appColors.lightColor} />
                    </TouchableOpacity>
                }
                <CustomListView
                    ref={refList}
                    horizontal
                    data={dataGroup}
                    extraData={dataGroup}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

export default GroupData;