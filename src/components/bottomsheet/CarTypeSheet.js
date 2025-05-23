import React from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { KEYs } from "../../utils/storageKeys";
import ItemCarType from "../items/ItemCarType";
import { Text } from "@rneui/base";
import { useDispatch } from "react-redux";
import { setProjectId } from "../../redux/actions";
import { deviceHeight } from "../../styles/styles";

const CarTypeSheet = ({ callBackData }) => {
    const { appColors } = useTheme()
    const dispatch = useDispatch()

    const handlerTypePress = (id) => {
        dispatch(setProjectId(id))
        callBackData(id)
    }

    const styles = StyleSheet.create({
        mainContainer: { width: '100%', height: deviceHeight / 2, backgroundColor: appColors.backgroundColor },
        contentContainer: { width: '100%', height: '100%', backgroundColor: appColors.backgroundColor }
    })

    return (
        <ActionSheet id={KEYs.ACTION_SHEET.CARTYPE_SHEET} containerStyle={styles.mainContainer}>
            <View style={styles.contentContainer}>
                <Text allowFontScaling={false} style={styles.titleHead}>{`Loại xe`}</Text>
                <ItemCarType value={1} title={`1. Xe du lịch`} onPress={handlerTypePress} />
                <ItemCarType value={2} title={`2. Xe thương mại`} onPress={handlerTypePress} />
                <ItemCarType value={3} title={`3. Xe thương mại (Loại nhỏ)`} onPress={handlerTypePress} />
            </View>
        </ActionSheet>
    )
}

export default CarTypeSheet;