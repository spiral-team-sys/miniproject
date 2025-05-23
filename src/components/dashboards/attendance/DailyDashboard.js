import { StyleSheet, TouchableOpacity, View } from "react-native";
import useTheme from "../../../hooks/useTheme";
import { Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { isValidData } from "../../../utils/validateData";
import appConfig from "../../../utils/appConfig/appConfig";
import { deviceWidth } from "../../../styles/styles";

const DailyDashboard = ({ data, title, pageDetail, navigation, onRefresh, disabled = false }) => {
    const { appColors } = useTheme()
    const [item, setItem] = useState({})
    //
    const handlerDetails = () => {
        pageDetail && navigation.navigate(pageDetail, { pageName: title })
    }
    //
    useEffect(() => {
        if (isValidData(data))
            setItem(data[0])
    }, [data])
    //
    const styles = StyleSheet.create({
        mainContainer: { width: deviceWidth - 32, height: '100%', borderRadius: 8, backgroundColor: appColors.cardColor },
        contentTitle: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8 },
        titleChart: { fontSize: 15, fontWeight: '700', color: appColors.textColor, marginStart: 8 },
        buttonRefresh: { position: 'absolute', top: 0, end: 8 },
        contentData: { flexDirection: 'row' },
        contentTitleData: { flexGrow: 1, marginEnd: 4 },
        contentValueData: { flexGrow: 1, marginStart: 4, borderTopLeftRadius: 8, borderTopEndRadius: 8, overflow: 'hidden' },
        titleName: { fontSize: 13, fontWeight: '500', color: appColors.lightColor, padding: 8 },
        titleValue: { fontSize: 28, fontWeight: 'bold', color: appColors.textColor, paddingHorizontal: 8 },
    })

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={handlerDetails} disabled={disabled}>
                <View style={styles.contentTitle}>
                    <Icon type={appConfig.ICON_TYPE} color={appColors.textColor} name="calendar" size={24} />
                    <Text style={styles.titleChart}>{title || 'Thống kê'}</Text>
                </View>
                <View style={styles.contentData}>
                    <View style={styles.contentTitleData}>
                        <Text style={{ ...styles.titleValue, color: appColors.linkColor }}>{item?.AValue || 0}</Text>
                        <Text style={{ ...styles.titleName, backgroundColor: appColors.linkColor }}>{item?.ALable || "Actual"}</Text>
                        <Text style={{ ...styles.titleValue, color: appColors.successColor, marginTop: 8 }}>{item?.TValue || 0}</Text>
                        <Text style={{ ...styles.titleName, backgroundColor: appColors.successColor }}>{item?.TLable || "Target"}</Text>
                    </View>
                    <View style={styles.contentValueData}>
                        <Text style={{ ...styles.titleValue, backgroundColor: appColors.warningColor, textAlign: 'center' }} >{item?.PValue || 0} </Text>
                        <Text style={{ ...styles.titleName, backgroundColor: appColors.warningColor, textAlign: 'center', color: appColors.textColor }}>{item?.PLable || '%'}</Text>
                        <Text style={{ ...styles.titleValue, color: appColors.errorColor, textAlign: 'right', marginTop: 8 }}>{item?.GAP || 0}</Text>
                        <Text style={{ ...styles.titleName, backgroundColor: appColors.errorColor, textAlign: 'right' }}>{item?.GLable || 'GAP'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRefresh} onPress={onRefresh}>
                <Icon type={appConfig.ICON_TYPE} color={appColors.textColor} name="sync" size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default DailyDashboard;