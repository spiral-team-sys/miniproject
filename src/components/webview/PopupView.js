import { useEffect, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";
import WebView from "react-native-webview";
import { KEYs } from "../../utils/storageKeys";
import CustomModal from "../modal/CustomModal";

const PopupView = ({ }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [url, setUrl] = useState(null)

    const openModal = (item) => {
        if (item?.pageName === "popup") {
            setModalVisible(true);
            setUrl(item.reportItem)
        }
    }
    const closeModal = () => {
        setModalVisible(false);
    }

    useEffect(() => {
        const _event = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.POPUP_WEBVIEW, openModal)
        return () => { _event.remove() }
    })

    const renderContent = () => {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                <WebView
                    scrollEnabled
                    source={{ uri: url }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    return (
        <CustomModal
            visible={isModalVisible}
            onClose={closeModal}
            children={renderContent()}
        />
    )
}
export default PopupView;