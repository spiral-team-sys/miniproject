import React from "react";
import { StyleSheet, View } from "react-native";
import ReportList from "../../components/lists/ReportList";

export const ShopReportScreen = ({ navigation }) => {
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 }
    })

    return (
        <View style={styles.mainContainer}>
            <ReportList navigation={navigation} />
        </View>
    )
}