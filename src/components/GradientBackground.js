import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';

const GradientBackground = () => {
    const { appColors } = useTheme()
    const colors = [appColors.primaryColor, appColors.secondaryColor]
    //
    return (
        <LinearGradient colors={colors} style={{ ...StyleSheet.absoluteFillObject }} />
    );
};

export default GradientBackground;
