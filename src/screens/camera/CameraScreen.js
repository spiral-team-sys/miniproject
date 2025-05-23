import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/base';
import useTheme from '../../hooks/useTheme';
import CameraPage from '../../components/camera/default';
import appConfig from '../../utils/appConfig/appConfig';
import { handlerGoBack } from '../../utils/helper';
import { paddingTopScreen } from '../../utils/utility';

const CameraScreen = ({ navigation }) => {
    const { appColors } = useTheme()

    const onBack = () => {
        handlerGoBack(navigation)
    }

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.darkColor },
        buttonBack: { position: 'absolute', top: paddingTopScreen, left: 8, zIndex: 20 }
    })

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={onBack} style={styles.buttonBack}>
                <Icon
                    raised
                    type={appConfig.ICON_TYPE}
                    name='arrow-back'
                    size={21}
                    containerStyle={{ opacity: 0.7 }}
                    color={appColors.opacityColor} />
            </TouchableOpacity>
            <CameraPage callBackData={onBack} />
        </View>
    );
};
export default CameraScreen;
