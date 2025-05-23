import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYs } from '../utils/storageKeys';
import NetInfo from '@react-native-community/netinfo'
import useNotificationManager from '../hooks/useNotificationManager';

export const ConnectContext = createContext();

export const ConnectProvider = ({ children }) => {
    const { cancelTrigger } = useNotificationManager()
    const [connectionType, setConnectionType] = useState(null);
    const [isOnlyWifi, setOnlyWifi] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            const saved = await AsyncStorage.getItem(KEYs.STORAGE.SETTING_ONLY_WIFI);
            setOnlyWifi(saved == 'true')
            setConnectionType(state.type)
        });
        return () => unsubscribe();
    }, [isOnlyWifi]);

    const toggleConnect = async () => {
        const newWifiState = !isOnlyWifi;
        setOnlyWifi(newWifiState);
        await AsyncStorage.setItem(KEYs.STORAGE.SETTING_ONLY_WIFI, `${newWifiState}`);
        if (!newWifiState) {
            await cancelTrigger();
            await AsyncStorage.removeItem(KEYs.STORAGE.TIME_SELECTED)
        }
    };

    return (
        <ConnectContext.Provider value={{ isOnlyWifi, connectionType, toggleConnect }}>
            {children}
        </ConnectContext.Provider>
    );
};