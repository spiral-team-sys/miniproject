import React, { useEffect, useState } from "react";
import useTheme from "../../../../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../../../../components/GradientBackground";
import Header from "../../../../../components/Header";
import Loading from "../../../../../components/Loading";
import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";
import { KEYs } from "../../../../../utils/storageKeys";
import CarTypeSheet from "../../../../../components/bottomsheet/CarTypeSheet";

const CreateLicenseScreen = ({ navigation }) => {
    const { projectId } = useSelector(state => state.project)
    const { appColors, styleDefault } = useTheme()
    const [isLoading, setLoading] = useState(false)

    const LoadData = () => {
        if (projectId == 0)
            SheetManager.show(KEYs.ACTION_SHEET.CARTYPE_SHEET)
        else
            SheetManager.hide(KEYs.ACTION_SHEET.CARTYPE_SHEET)
    }

    const handlerCallBack = (id) => {
        console.log(id);
    }

    const onBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        LoadData()
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.primaryColor }
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Tạo mới biển số'
                onLeftPress={onBack}
            />
            <Loading isLoading={isLoading} color={appColors.primaryColor} />
            <View style={styleDefault.contentMain}>
                <CarTypeSheet callBackData={handlerCallBack} />
            </View>
        </SafeAreaView>
    )
}

export default CreateLicenseScreen;