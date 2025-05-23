import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated, Easing, Linking } from 'react-native';
import { Icon } from '@rneui/themed';
import { fontWeightBold } from '../../utils/utility';
import NetInfo from '@react-native-community/netinfo';
import useTheme from '../../hooks/useTheme';

const NetworkStatus = ({ }) => {
    const { appColors } = useTheme()
    const [isConnected, setIsConnected] = useState(true);
    const [isInternetReachable, setIsInternetReachable] = useState(true);
    const slideAnim = useRef(new Animated.Value(100)).current;

    const openSettings = async () => {
        Linking.openSettings();
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            setIsInternetReachable(state.isInternetReachable)
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isConnected || !isInternetReachable) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true
            }).start();
        }
    }, [isConnected, isInternetReachable]);

    const styles = StyleSheet.create({
        mainContainer: { transform: [{ translateY: slideAnim }], padding: 12, marginHorizontal: 16, borderRadius: 8, position: 'absolute', start: 0, end: 0, bottom: Platform.OS == 'android' ? 16 : 32, backgroundColor: appColors.textColor },
        content: { width: '100%', flexDirection: 'row', alignItems: 'center' },
        title: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.backgroundColor, paddingStart: 8 },
        button: { borderStartWidth: 1, borderStartColor: appColors.backgroundColor, position: 'absolute', end: 0, top: 0, bottom: 0, justifyContent: 'center' }
    })
    if (!isConnected || !isInternetReachable)
        return (
            <Animated.View style={styles.mainContainer}>
                <View style={styles.content}>
                    <Icon type={"material"} name='wifi-off' color={appColors.errorColor} size={24} />
                    <Text style={styles.title}>Mất kết nối internet</Text>
                    <TouchableOpacity style={styles.button} onPress={openSettings}>
                        <Text style={styles.title}>Mở cài đặt</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    return <View />
};

export default NetworkStatus;
