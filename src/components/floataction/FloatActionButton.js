import React, { useEffect, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import ActionItem from "./ActionItem";
import useTheme from "../../hooks/useTheme";
import { fontWeightBold } from "../../utils/utility";

const FloatActionButton = ({ visible = true, isUploaded = false, info, tabInfo, showMenu, handlerChange }) => {
    const { appColors } = useTheme()
    const { audioInfo } = useSelector(state => state.audio)
    // 
    useEffect(() => {
        return () => { }
    }, [info, tabInfo])

    // View
    const styles = StyleSheet.create({
        mainContainer: { alignItems: 'flex-end', position: 'absolute', bottom: Platform.OS == 'ios' ? 24 : 16, end: 16, zIndex: 1000 },
        titleName: { width: '100%', fontSize: 13, color: appColors.lightColor, fontWeight: fontWeightBold, textAlign: 'center' },
        contentMenu: { alignItems: 'flex-end' }
    })
    const renderItemMenu = () => {
        return (
            <View style={styles.contentMenu}>
                {!isUploaded &&
                    <ActionItem
                        typeAction='AUDIO'
                        title={audioInfo?.isRecorder ? 'Đang ghi âm' : 'Ghi âm'}
                        iconName='mic'
                        iconColor={audioInfo?.isRecorder ? appColors.errorColor : appColors.primaryColor}
                        onPress={handlerChange} />
                }
                {!isUploaded &&
                    <ActionItem
                        typeAction='CAMERA'
                        title={`Chụp hình ${tabInfo.tabName}`}
                        iconName='camera'
                        onPress={handlerChange} />
                }
                <ActionItem
                    typeAction='ALBUM'
                    title={`Thư viện hình ${tabInfo.tabName} & Ghi âm`}
                    iconName='images'
                    badgeValue={tabInfo.countPhoto || null}
                    onPress={handlerChange} />
                {!isUploaded &&
                    <ActionItem
                        typeAction='CHECKALL'
                        title={`Chọn tất cả "Không" ${tabInfo.tabName}`}
                        iconName='checkmark-circle'
                        onPress={handlerChange} />
                }
                {!isUploaded &&
                    <ActionItem
                        typeAction='REFRESHDATA'
                        title={`Làm mới dữ liệu ${tabInfo.tabName}`}
                        iconName='refresh-circle'
                        onPress={handlerChange} />
                }
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            {visible && info.isOpen && renderItemMenu()}
            {visible &&
                <ActionItem
                    isMain
                    iconColor={appColors.lightColor}
                    backgroundColor={appColors.primaryColor}
                    typeAction='MAIN'
                    title={info.title}
                    iconName={info.isOpen ? 'chevron-down-outline' : info.type !== null && info.type.length > 0 ? 'close' : 'grid'}
                    onPress={showMenu} />
            }
        </View>
    )
}
export default FloatActionButton;