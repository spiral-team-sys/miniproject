import React from "react";
import useTheme from "../../hooks/useTheme";
import { Modal, StyleSheet, View } from "react-native";
import { fontWeightBold } from "../../utils/utility";
import { Text } from "@rneui/themed";
import Button from "../button/Button";

const CustomModal = ({ visible, onClose, title, children }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.primaryColor },
        modalContainer: { width: '95%', height: '97%', backgroundColor: appColors.backgroundColor, borderRadius: 10, padding: 16, shadowColor: appColors.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
        title: { fontSize: 18, fontWeight: fontWeightBold, marginBottom: 8 },
        content: { flex: 1, marginBottom: 16 },
        closeButton: { alignSelf: 'flex-end', backgroundColor: appColors.errorColor, paddingHorizontal: 16, borderRadius: 5, margin: 0 },
        closeButtonText: { color: appColors.lightColor, fontSize: 14 }
    })

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {children && <View style={styles.content}>{children}</View>}
                    <Button
                        title='Đóng'
                        style={styles.closeButton}
                        onPress={onClose}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal;