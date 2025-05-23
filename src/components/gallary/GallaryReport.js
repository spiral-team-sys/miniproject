import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { PHOTO_CONTROLLER } from "../../controllers/PhotoController";
import { useSelector } from "react-redux";
import { Text } from "@rneui/themed";
import { isValidData } from "../../utils/validateData";
import Loading from "../Loading";
import _ from 'lodash';
import CustomTab from "../CustomTab";
import { DATA_DEFAULT } from "../../utils/data/dataDefault";
import GallaryAudios from "./GallaryAudios";
import GallaryPhotosGrid from "./GallaryPhotosGrid";
import { AUDIO_CONTROLLER } from "../../controllers/AudioController";

const GallaryReport = ({ isReloadData, byShop = true }) => {
    const { appColors } = useTheme()
    const { shopInfo } = useSelector(state => state.shop)
    const [dataGallary, setDataGallary] = useState([])
    const [dataAudio, setDataAudio] = useState([])
    const [isLoading, setLoading] = useState(true)
    //
    const LoadData = async () => {
        !isLoading && await setLoading(true)
        await PHOTO_CONTROLLER.GetDataGallaryReport({ ...shopInfo, byShop }, setDataGallary)
        await AUDIO_CONTROLLER.GetDataGallaryAudio(shopInfo.shopId, setDataAudio)
        await setLoading(false)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        LoadData()
        return () => { isMounted = false }
    }, [isReloadData])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.backgroundColor },
        titleNoData: { fontSize: 13, fontWeight: '500', color: appColors.textColor, textAlign: 'center', padding: 16 },
    })

    const renderItemTab = (item, index) => {
        switch (item.PageName) {
            case "Photos":
                return <GallaryPhotosGrid key={index} shopInfo={shopInfo} />
            case "Audios":
                return <GallaryAudios key={index} shopInfo={shopInfo} />
        }
    }
    if (!isValidData(dataGallary)) return <Text style={styles.titleNoData}>Không có hình ảnh</Text>
    if (isLoading) return <Loading isLoading={isLoading} color={appColors.textColor} />
    return (
        <View style={styles.mainContainer}>
            {dataAudio.length > 0 ?
                <CustomTab
                    data={DATA_DEFAULT.dataGallary}
                    appColors={appColors}
                    renderItem={renderItemTab}
                />
                :
                <GallaryPhotosGrid shopInfo={shopInfo} />
            }
        </View>
    )
}
export default GallaryReport;