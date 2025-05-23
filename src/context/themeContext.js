import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';
import createStyles from '../styles/styles';
import { KEYs } from '../utils/storageKeys';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [appColors, setAppColors] = useState(colors.light);
    const [theme, setTheme] = useState('light')
    const [styleDefault, setStyleDefault] = useState(createStyles(colors.light));

    const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem(KEYs.THEME.APP_THEME);
        if (savedTheme) {
            const newTheme = colors[savedTheme];
            setTheme(savedTheme)
            setAppColors(newTheme);
            setStyleDefault(createStyles(newTheme));
        } else {
            setTheme('light')
        }
    };

    useEffect(() => {
        loadTheme();
    }, [appColors]);

    const toggleTheme = async () => {
        const newColorTheme = appColors === colors.light ? colors.dark : colors.light;
        const newTheme = newColorTheme === colors.light ? 'light' : 'dark'
        //
        setTheme(newTheme)
        setAppColors(newColorTheme);
        setStyleDefault(createStyles(newColorTheme));
        await AsyncStorage.setItem(KEYs.THEME.APP_THEME, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ appColors, theme, styleDefault, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
