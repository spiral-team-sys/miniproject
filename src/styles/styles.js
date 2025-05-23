import { Dimensions, StyleSheet } from 'react-native';
import { fontWeightBold } from '../utils/utility';

export const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
export const inputHeight = 44

const createStyles = (appColors) => StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 16 },
    contentMain: { width: '100%', height: '100%', backgroundColor: appColors.backgroundColor, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
    contentStatus: { alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, zIndex: 1000 },
    cardView: { width: '100%', padding: 8, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: appColors.backgroundColor, shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.5, elevation: 3, borderWidth: 1, borderColor: appColors.borderColor },
    contentItemMain: { backgroundColor: appColors.backgroundColor, borderRadius: 8, padding: 8, shadowColor: appColors.shadowColor, shadowOpacity: 0.5, shadowOffset: { width: 1, height: 3 }, elevation: 3, borderWidth: 1, borderColor: appColors.borderColor },
    refreshView: { padding: 8 },
    overflowView: { width: '100%', height: deviceHeight, position: 'absolute', zIndex: 1, backgroundColor: appColors.darkColor, opacity: 0.65, justifyContent: 'center' },
    titleName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor },
    subTitleName: { fontSize: 11, fontWeight: '500', color: appColors.subTextColor }
});

export default createStyles;