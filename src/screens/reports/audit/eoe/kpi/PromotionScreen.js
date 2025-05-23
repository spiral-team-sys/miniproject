import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import useTheme from "../../../../../hooks/useTheme";
import { groupDataByKey } from "../../../../../utils/helper";
import { deviceHeight } from "../../../../../styles/styles";
import CustomListView from "../../../../../components/lists/CustomListView";
import { Icon, Text } from "@rneui/themed";
import appConfig from "../../../../../utils/appConfig/appConfig";
import { fontWeightBold } from "../../../../../utils/utility";
import GroupCheckBox from "../../../../../components/GroupCheckBox";
import FieldNoteKPI from "../../../../../components/fields/eoe/FieldNoteKPI";
import FastImage from "react-native-fast-image";
import _ from 'lodash';

const PromotionScreen = ({ itemMain, data, isUploaded = false, isRefreshData = false, callBackData }) => {
    const { appColors, styleDefault } = useTheme()
    const [dataPromotion, setDataPromotion] = useState([])
    const [_mutate, setMutate] = useState(false)
    const listRef = useRef()
    //
    const LoadData = () => {
        const { arr } = groupDataByKey({
            arr: data,
            key: 'GroupId'
        })
        setDataPromotion(arr)
    }
    // Handler
    const handlerSaveItem = (dataUpdate) => {
        itemMain.JsonData = JSON.stringify(dataUpdate || dataPromotion)
        setDataPromotion(dataUpdate || dataPromotion)
        callBackData(itemMain)
    }
    const handlerCheckItem = (value, item) => {
        item.DisplayValue = value
        setMutate(e => !e)
        handlerSaveItem(dataPromotion)
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
        mainContainer: { width: '100%', height: '100%', backgroundColor: appColors.backgroundColor, marginTop: 8 },
        itemMain: { width: '100%', padding: 8 },
        viewHeadGroup: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 8, paddingTop: 0 },
        titleGroup: { fontSize: 14, fontWeight: '700', color: appColors.subTextColor, fontStyle: 'italic', paddingHorizontal: 8 },
        titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor },
        titleSubName: { fontSize: 13, fontWeight: '500', color: appColors.subTextColor },
        actionView: { width: '100%' },
        contentCheckBox: { width: '35%', alignSelf: 'flex-end' },
        bottomView: { paddingBottom: deviceHeight / 6 },
        labelStyle: { paddingTop: 8, fontSize: 12, fontStyle: 'italic' }
    })
    const renderItem = ({ item, index }) => {
        const onCheckBoxPress = (value) => {
            handlerCheckItem(value, item, index)
        }
        return (
            <View key={`svi_${index}`} style={styles.itemMain}>
                {item.isParent &&
                    <View style={styles.viewHeadGroup}>
                        <Icon type={appConfig.ICON_TYPE} name="ellipse" color={appColors.highlightColor} />
                        <Text style={styles.titleGroup}>{item.GroupName}</Text>
                    </View>
                }
                <View style={styleDefault.contentItemMain}>
                    <Text style={styles.titleName}>{`${index + 1}. ${item?.ItemName}`}</Text>
                    <FastImage
                        source={{ uri: item.PhotoPath || `${appConfig.URL_ROOT}/images/noimage.png`, priority: 'low' }}
                        style={{ width: '100%', height: 150, alignItems: "center", marginBottom: 8 }}
                        placeholderStyle={{ backgroundColor: 'transparent' }}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                    <View style={styles.actionView}>
                        <GroupCheckBox
                            enabled title1={item?.YesButton || 'Có'}
                            title2={item?.NoButton || 'Không'}
                            isUploaded={isUploaded}
                            itemMain={item}
                            contentStyle={{ flexDirection: item?.YesButton == "Không" ? "row-reverse" : "row" }}
                            onPress={onCheckBoxPress}
                        />
                    </View>
                </View>
            </View>
        )
    }
    if (isRefreshData) return <ActivityIndicator size='small' color={appColors.primaryColor} style={styleDefault.refreshView} />
    return (
        <View style={styles.mainContainer}>
            <FieldNoteKPI
                placeholder={`Ghi chú ${itemMain.ItemCode}`}
                value={itemMain.NoteKPIValue}
                onChangeData={onNote}
            />
            <CustomListView
                ref={listRef}
                data={dataPromotion}
                extraData={[dataPromotion]}
                renderItem={renderItem}
            />
        </View>
    )
}

export default PromotionScreen;