import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import CustomListView from './CustomListView'
import { useSelector } from 'react-redux'
import ItemCapturePhotos from '../items/ItemCapturePhoto'
import _ from 'lodash'
import { deviceHeight } from '../../styles/styles'

const CapturePhotoList = ({ navigation, data = [], status }) => {
    const { menuReportInfo } = useSelector(state => state.menu)
    const [dataMain, setDataMain] = useState([])
    const LoadData = () => {
        setDataMain(data)
    }

    useEffect(() => {
        LoadData()
    }, [data])

    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: '100%', paddingBottom: 8 },
        viewList: { height: '100%', width: '100%' },
        bottomView: { paddingBottom: deviceHeight / 6 }
    })
    const renderItem = ({ item, index }) => {
        return (
            <ItemCapturePhotos
                key={index}
                uploaded={status}
                item={item}
                index={index}
                menuReportInfo={menuReportInfo}
                navigation={navigation}
                dataMain={dataMain}
            />
        )
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.viewList}>
                <CustomListView
                    data={dataMain}
                    extraData={dataMain}
                    renderItem={renderItem}
                    bottomView={styles.bottomView}
                />
            </View>
        </View>
    )
}

export default CapturePhotoList