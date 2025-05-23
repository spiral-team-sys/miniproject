import React from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { handlerGoBack } from "../../utils/helper";

const GalleryTimelineScreen = ({ navigation }) => {
    const { appColors } = useTheme()
    const { menuHomeInfo } = useSelector(state => state.menu)

    const LoadData = () => {

    }

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        contentMain: {}
    })

    return (
        <View style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={menuHomeInfo.menuNameVN}
                onLeftPress={() => handlerGoBack(navigation)}
            />
            <View style={styles.contentMain}>

            </View>
        </View>
    )
}
export default GalleryTimelineScreen;