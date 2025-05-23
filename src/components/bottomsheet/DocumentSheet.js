import React, { useState } from 'react'
import { fontWeightBold } from '../../utils/utility'
import useTheme from '../../hooks/useTheme'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import WebView from 'react-native-webview'
import { Icon } from '@rneui/themed'
import { deviceHeight } from '../../styles/styles'
import appConfig from '../../utils/appConfig/appConfig'
import ActionSheet, { SheetManager } from 'react-native-actions-sheet'
import Loading from '../Loading'
import { KEYs } from '../../utils/storageKeys'

const DocumentSheet = ({ onBeforeShow, url }) => {
    const { appColors } = useTheme()
    const [loading, setLoading] = useState(false)

    const onClose = () => {
        SheetManager.hide(KEYs.ACTION_SHEET.DOCUMENT_SHEET)
    }

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.darkColor },
        webview: { height: '100%', width: '100%' },
        contentWebview: { flex: 1, },
        nameDoc: { color: appColors.darkColor, fontSize: 15, fontWeight: fontWeightBold },
        desDoc: { color: appColors.darkColor, fontSize: 13, fontStyle: 'italic', opacity: 0.8 },
        textButonDoc: { fontSize: 13, color: appColors.primaryColor, fontWeight: 'bold' },
        dateDoc: { fontSize: 11, color: appColors.darkColor, fontStyle: 'italic', opacity: 0.8 },
        containListDoc: { flex: 1, padding: 12, borderRadius: 8, margin: 8, shadowColor: appColors.textColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: appColors.lightColor },
        mainListDoc: { flex: 1 },
        buttonClose: { position: 'absolute', top: deviceHeight / 25, right: 0, padding: 8 },
        containButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
        mainWebview: { height: '100%' }
    })

    return (
        <ActionSheet id={KEYs.ACTION_SHEET.DOCUMENT_SHEET} containerStyle={styles.mainContainer} onBeforeShow={onBeforeShow}>
            <View style={styles.mainWebview}>
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    onLoadStart={() => setLoading(true)}
                    onError={() => setLoading(false)}
                    renderLoading={() => <Loading isLoading={loading} />}
                    scrollEnabled
                    cacheEnabled
                    pullToRefreshEnabled
                    cacheMode="LOAD_CACHE_ELSE_NETWORK"
                    nestedScrollEnabled
                />
            </View>
            <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
                <Icon
                    raised
                    type={appConfig.ICON_TYPE}
                    color={appColors.primaryColor}
                    name='close'
                    size={22} />
            </TouchableOpacity>
        </ActionSheet>
    )
}
export default DocumentSheet