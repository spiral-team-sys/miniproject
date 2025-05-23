import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/base';
import useTheme from '../../hooks/useTheme';
import appConfig from '../../utils/appConfig/appConfig';
import { handlerGoBack } from '../../utils/helper';
import CameraReportPage from '../../components/camera/reports';
import { CAMERA_PERMISSION, checkAndRequestPermission } from '../../utils/permissions';
import { paddingTopScreen } from '../../utils/utility';

const CameraReportScreen = ({ navigation, route }) => {
    const { appColors } = useTheme()

    const LoadData = async () => {
        await checkAndRequestPermission(CAMERA_PERMISSION)
    }

    const onBack = () => {
        handlerGoBack(navigation)
    }

    useEffect(() => {
        LoadData()
    }, [])

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
            <CameraReportPage
                callBackData={onBack}
                templateInfo={route?.params?.templateInfo || {}}
            />
        </View>
    );
};
export default CameraReportScreen;
