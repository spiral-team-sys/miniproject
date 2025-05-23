import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import { Text } from '@rneui/themed';

const Loading = ({ isLoading, message = '', color, isOpacityView = false }) => {
    const { appColors } = useTheme()

    const styles = StyleSheet.create({
        mainContainer: { alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1000, top: 0, bottom: 0, start: 0, end: 0 },
        titleView: { fontSize: 12, fontWeight: '500', color: appColors.textColor, padding: 8, textAlign: 'center', paddingHorizontal: 16 },
        opacityView: { width: '100%', height: '100%', position: 'absolute', backgroundColor: appColors.whiteColor, opacity: 0.5 }
    })

    if (!isLoading) return <View />
    return (
        <SafeAreaView style={styles.mainContainer}>
            {isOpacityView && <View style={styles.opacityView} />}
            {message && <Text style={styles.titleView}>{message}</Text>}
            <ActivityIndicator size='small' color={color || appColors.lightColor} style={styles.loading} />
        </SafeAreaView>
    )
};
export default Loading;
