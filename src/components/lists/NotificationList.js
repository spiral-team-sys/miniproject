import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import CustomListView from "./CustomListView";
import ItemNotification from "../items/ItemNotification";
import _ from 'lodash';

const NotificationList = ({ dataMain = [], onRefreshData }) => {
    const { appColors } = useTheme()
    const [dataNotification, setDataNotification] = useState([])
    //
    const LoadData = () => {
        const dataFilter = _.filter(dataMain, (e) => e.remove == 0)
        setDataNotification(dataFilter)
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
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        bottomView: { paddingBottom: 56 }
    })
    const renderItem = ({ item, index }) => {
        return <ItemNotification item={item} index={index} onReloadData={LoadData} />
    }
    return (
        <View style={styles.mainContainer}>
            <CustomListView
                isCheckData
                data={dataNotification}
                extraData={dataNotification}
                renderItem={renderItem}
                onRefresh={onRefreshData}
                bottomView={styles.bottomView}
            />
        </View>
    )
}

export default NotificationList;