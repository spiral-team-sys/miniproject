import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import useTheme from "../../hooks/useTheme";
import { Text } from "@rneui/themed";
import { deviceHeight } from "../../styles/styles";
import { fontWeightBold } from "../../utils/utility";

const ButtonConfirm = ({ isVisible = false, mainContainerStyle, content, onDownload, onCannel, onDelete }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: appColors.cardColor, width: '100%', height: deviceHeight / (Platform.OS == 'ios' ? 10 : 12), flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
            position: 'absolute', bottom: Platform.OS == 'ios' ? (deviceHeight / 10) : deviceHeight / 15,
            elevation: 3, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.5,
            borderTopWidth: 0.5, borderTopColor: appColors.borderShadowColor,
        },
        titleView: { width: '36%', padding: 8, fontSize: 12, fontWeight: fontWeightBold, color: appColors.textColor },
        downloadButton: { width: '20%', backgroundColor: appColors.warningColor, marginEnd: 8, borderRadius: 8, borderWidth: 0.5, borderColor: appColors.warningColor },
        downloadTitle: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.textColor, textAlign: 'center', padding: 8 },

        rejectButton: { width: '20%', backgroundColor: appColors.lightColor, marginEnd: 8, borderRadius: 8, borderWidth: 0.5, borderColor: appColors.darkColor },
        rejectTitle: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.textColor, textAlign: 'center', padding: 8 },

        deleteButton: { width: '20%', backgroundColor: appColors.errorColor, marginEnd: 8, borderRadius: 8, borderWidth: 0.5, borderColor: appColors.errorColor },
        deleteTitle: { fontSize: 12, fontWeight: fontWeightBold, color: appColors.lightColor, textAlign: 'center', padding: 8 },
    })

    if (!isVisible) return <View />
    return (
        <View style={[styles.mainContainer, mainContainerStyle]}>
            <Text style={styles.titleView}>{content}</Text>
            {onCannel &&
                <TouchableOpacity style={styles.rejectButton} onPress={onCannel}>
                    <Text style={styles.rejectTitle}>Hủy</Text>
                </TouchableOpacity>
            }
            {onDelete &&
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteTitle}>Xoá</Text>
                </TouchableOpacity>
            }
            {onDownload &&
                <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
                    <Text style={styles.downloadTitle}>Tải về</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export default ButtonConfirm;