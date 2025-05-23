import React, { useEffect, useState } from 'react';
import { StyleSheet, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import GradientBackground from '../../components/GradientBackground';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import CustomTab from '../../components/CustomTab';
import GallaryPhotos from '../../components/gallary/GallaryPhotos';
import GallaryAudios from '../../components/gallary/GallaryAudios';
import { DATA_DEFAULT } from '../../utils/data/dataDefault';
import { isValidData, isValidField } from '../../utils/validateData';
import { handlerGoBack } from '../../utils/helper';
import _ from 'lodash';

const GallaryScreen = ({ navigation, route }) => {
    const { appColors, styleDefault } = useTheme();
    const { shopInfo } = useSelector(state => state.shop)
    const { menuReportInfo } = useSelector(state => state.menu)
    const [dataGallary, setDataGallary] = useState([])
    const [gallaryInfo, setGallaryInfo] = useState({ photo: [], audio: [] })
    // 
    const LoadData = () => {
        const { mode = null, data = [] } = route?.params || {}
        // 
        if (isValidData(data)) {
            const _photos = _.filter(data, (e) => e.photoType !== 'AUDIO')
            const _audios = _.filter(data, (e) => e.photoType == 'AUDIO')
            setGallaryInfo({
                photo: _photos,
                audio: _audios
            })
        }
        //
        if (isValidField(mode)) {
            switch (mode) {
                case "IMAGE":
                    setDataGallary([DATA_DEFAULT.dataGallary[0]])
                    break
                case "AUDIO":
                    setDataGallary([DATA_DEFAULT.dataGallary[1]])
                    break
            }
        } else {
            setDataGallary(DATA_DEFAULT.dataGallary)
        }
    }
    const onBack = () => {
        handlerGoBack(navigation)
    }
    //
    useEffect(() => {
        LoadData()
        return () => { }
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })
    const renderItemTab = (item, index) => {
        switch (item.PageName) {
            case "Photos":
                return <GallaryPhotos
                    key={index}
                    data={gallaryInfo.photo || []}
                    shopInfo={shopInfo}
                    menuReportInfo={menuReportInfo}
                />
            case "Audios":
                return <GallaryAudios
                    key={index}
                    data={gallaryInfo.audio || []}
                    shopInfo={shopInfo} />
        }
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Thư viện'
                onLeftPress={onBack}
            />
            <View style={styleDefault.contentMain}>
                <CustomTab
                    scrollEnabled={false}
                    data={dataGallary}
                    appColors={appColors}
                    renderItem={renderItemTab}
                />
            </View>
        </SafeAreaView>
    );
};
export default GallaryScreen;
