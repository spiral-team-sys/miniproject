import React, { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import NotificationList from "../../components/lists/NotificationList";
import { NOTIFICATION_API } from "../../services/apiNotification";
import { toastSuccess } from "../../utils/configToast";
import GroupData from "../../components/GroupData";
import { isValidData } from "../../utils/validateData";
import { KEYs } from "../../utils/storageKeys";
import NotificationDetailsSheet from "../../components/bottomsheet/NotificationDetailsSheet";
import { groupDataByKey } from "../../utils/helper";
import useNotificationManager from "../../hooks/useNotificationManager";
import _ from 'lodash';

const NotificationScreen = ({ }) => {
    const { appColors, styleDefault } = useTheme()
    const { handlerCountNotification } = useNotificationManager()
    const [dataMain, setDataMain] = useState([])
    const [dataView, setDataView] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [itemData, setItemData] = useState({})
    const sheetRef = useRef(null);

    const LoadData = async () => {
        await setLoading(true)
        await NOTIFICATION_API.getDataNotification((mData, message) => {
            message && toastSuccess('Thông báo', message)
            const { arr } = groupDataByKey({
                arr: mData,
                key: 'groupName'
            })
            setDataMain(arr)
            setDataView(arr)
        })
        await handlerCountNotification()
        await setLoading(false)
    }
    // Handler
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        const listChooseGroup = _.map(dataMain, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        const notifyByGroup = _searchData(listChooseGroup)
        await setDataMain(listChooseGroup)
        await setDataView(notifyByGroup)
    }
    const _searchData = (filterList) => {
        const dataChooseTag = _.filter(filterList, (e) => e.isChooseTag == 1)
        return !isValidData(dataChooseTag) ? filterList : dataChooseTag
    }
    const handlerShowDetailNotify = (item) => {
        if (sheetRef.current) {
            setItemData(item)
            sheetRef.current.snapToIndex(0);
        }
    }
    //
    useEffect(() => {
        const _detailNotification = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.NOTIFICATION_SHEET_DETAILS, handlerShowDetailNotify)
        LoadData()
        return () => { _detailNotification.remove() }
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        contentMain: { flex: 1 }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header title='Thông báo' />
            <View style={styleDefault.contentMain}>
                <Loading isLoading={isLoading} color={appColors.primaryColor} />
                <View style={styles.contentMain}>
                    <GroupData
                        dataMain={dataMain}
                        keyName='typeName'
                        keyValue='typeName'
                        handlerChange={handlerSearchByGroup}
                    />
                    <NotificationList
                        dataMain={dataView}
                        onRefreshData={LoadData}
                    />
                    <NotificationDetailsSheet ref={sheetRef} item={itemData} />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default NotificationScreen;