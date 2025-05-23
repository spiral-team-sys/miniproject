import appConfig from "../utils/appConfig/appConfig";

const list = [
    '#FF5F1F', '#32CD32', '#6D9773', '#0C3B2E', '#BB8A52', '#FFBA00', '#4F7942', '#F88379', '#4169E1',
    '#770737', '#32CD32', '#0F52BA', '#4682B4', '#FF4433', '#9F2B68', '#FA5F55', '#FA8072', '#FFAA33',
    '#F4BB44', '#088F8F', '#097969', '#228B22', '#40B5AD', '#6495ED', '#0818A8', '#E3735E', '#FF3131'
]

const colors = {
    light: {
        backgroundColor: '#FFFFFF',
        primaryColor: appConfig.PRIMARY_COLOR,
        secondaryColor: appConfig.SECONDARY_COLOR,
        tertiaryColor: appConfig.TERTIARY_COLOR,
        textColor: '#212121',
        unselectColor: '#3C3D37',
        subTextColor: '#757575',
        borderColor: '#F0F0F0',
        cardColor: '#FAFAFA',
        grayColor: '#BDBDBD',
        successColor: '#4CAF50',
        warningColor: '#FFC107',
        errorColor: '#F44336',
        linkColor: '#2196F3',
        highlightColor: '#FF0000',
        placeholderColor: '#9E9E9E',
        disabledColor: '#BDBDBD',
        lightColor: '#FFFFFF',
        darkColor: '#212121',
        borderShadowColor: '#E0E0E0',
        shadowColor: '#B0BEC5',
        whiteColor: '#FFFFFF',
        opacityColor: '#000000',
        listColor: list,
    },
    dark: {
        backgroundColor: '#181C14',
        unselectColor: '#B7B7B7',
        primaryColor: appConfig.PRIMARY_COLOR,
        secondaryColor: appConfig.SECONDARY_COLOR,
        tertiaryColor: appConfig.TERTIARY_COLOR,
        textColor: '#FFFFFF',
        subTextColor: '#BDBDBD',
        borderColor: '#616161',
        cardColor: '#424242',
        grayColor: '#F0F0F0',
        successColor: '#4CAF50',
        warningColor: '#FFC107',
        errorColor: '#F44336',
        linkColor: '#2196F3',
        highlightColor: '#FF0000',
        placeholderColor: '#757575',
        disabledColor: '#616161',
        lightColor: '#212121',
        darkColor: '#FFFFFF',
        borderShadowColor: '#424242',
        shadowColor: '#000000',
        whiteColor: '#FFFFFF',
        opacityColor: '#000000',
        listColor: list,
    }
};
export default { ...colors, transparent: 'transparent' };
