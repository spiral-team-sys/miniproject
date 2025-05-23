// Plan: Lịch làm việc theo tháng 
import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import { handlerGoBack } from "../../utils/helper";

const MonthPlanScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()

    const LoadData = () => {

    }

    useEffect(() => {
        LoadData()
    }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Lịch làm việc tháng'
                onLeftPress={() => handlerGoBack(navigation)}
            />
            <View style={styleDefault.contentMain}>

            </View>
        </SafeAreaView>
    )
}
export default MonthPlanScreen;