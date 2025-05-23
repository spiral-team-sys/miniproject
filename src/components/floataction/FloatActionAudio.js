import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import ActionItem from "./ActionItem";
import useTheme from "../../hooks/useTheme";
import { fontWeightBold } from "../../utils/utility";

const FloatActionAudio = ({ visible = true, isDoneReport = false, info, showMenu, handlerChange }) => {
    const { appColors } = useTheme()
    const { audioInfo } = useSelector(state => state.audio)
    // const _fadeInDown = FadeInDown.duration(500).withInitialValues({ transform: [{ translateY: 420 }] })
    // const _fadeOutDown = FadeOutDown.duration(100).withInitialValues({ transform: [{ translateY: 420 }] })
    // 
    useEffect(() => {
        return () => false
    }, [info])

    // View
    const styles = StyleSheet.create({
        mainContainer: { alignItems: 'flex-end', position: 'absolute', bottom: 32, end: 16, zIndex: 1000 },
        titleName: { width: '100%', fontSize: 13, color: appColors.lightColor, fontWeight: fontWeightBold, textAlign: 'center' },
        contentMenu: { alignItems: 'flex-end' }
    })
    const renderItemMenu = () => {
        return (
            <View style={styles.contentMenu}>
                {!isDoneReport &&
                    <ActionItem
                        typeAction='AUDIO'
                        title={audioInfo?.isRecorder ? 'Đang ghi âm' : 'Ghi âm'}
                        iconName='mic'
                        iconColor={audioInfo?.isRecorder ? appColors.errorColor : appColors.primaryColor}
                        onPress={handlerChange} />
                }
                <ActionItem
                    typeAction='ALBUM'
                    title={`Thư viện ghi âm`}
                    iconName='images'
                    onPress={handlerChange} />
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            {visible && info.isOpen && renderItemMenu()}
            {visible &&
                <ActionItem
                    isMain
                    typeAction='MAIN'
                    backgroundColor={appColors.primaryColor}
                    iconColor={appColors.lightColor}
                    title={info.title}
                    iconName={info.isOpen ? 'chevron-down-outline' : info.type !== null && info.type.length > 0 ? 'close' : 'mic'}
                    onPress={showMenu} />
            }
        </View>
    )
}
export default FloatActionAudio;