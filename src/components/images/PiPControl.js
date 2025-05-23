import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import { deviceHeight, deviceWidth } from '../../styles/styles';
import Carousel from 'react-native-reanimated-carousel';
import { Icon } from '@rneui/base';
import WebView from 'react-native-webview'
import { Modal } from 'react-native';
import useTheme from '../../hooks/useTheme';
import appConfig from '../../utils/appConfig/appConfig';
const { width, height } = Dimensions.get('window');
const data_temp = [{ "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997599101395621283597711799.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318999462116145817548076693975.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318995762782473624570642923111.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996142161015310613847139622.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996426172109136138301243527.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996531776065389446029919106.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996667088942578448207616583.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996801305030735554797669024.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318996908635944999035625418160.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997023074289859396025575773.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997164535039389541414633107.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997296041117135012142700424.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997382265804195996166800112.jpeg" }, { "UrlImage": "https://eoe.spiral.com.vn/upload/Images/20241118/THIQUYET_17318997491741585554468549148614.jpeg" }]
const PiPControl = ({ data, intialPositon, controlCenter }) => {
    const { appColors } = useTheme()
    const [isPinned, setIsPinned] = useState(false); // Trạng thái ghim
    const pan = useRef(new Animated.ValueXY(intialPositon || { x: 100, y: 100 })).current;
    const [isExpend, setExpend] = useState(true)
    const [urlImage, setUrlImage] = useState(null);
    // Xử lý PanResponder
    const photos = data?.filter(p => p.photoType != 'AUDIO')
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false } // Phải tắt native driver do dùng translateX/Y
            ),
            onPanResponderRelease: (_, gestureState) => {
                // Tính vị trí mới
                const newX = Math.max(0, Math.min(width - 150, pan.x._value));
                const newY = Math.max(0, Math.min(height - 150, pan.y._value));
                // Di chuyển về vị trí hợp lệ
                Animated.spring(pan, {
                    toValue: { x: newX, y: newY },
                    useNativeDriver: false,
                }).start();
                pan.flattenOffset(); // Xóa offset cũ
            }
        })
    ).current;
    return (
        <>
            <Animated.View
                style={[
                    isExpend ? styles.pipContainer : styles.unPin,
                    {
                        transform: pan.getTranslateTransform(), // Hiệu ứng di chuyển
                    },
                ]}
                {...(isPinned ? {} : panResponder.panHandlers)} // Vô hiệu hóa kéo nếu đang ghim
            >
                {
                    isExpend ? (
                        <View style={styles.content}>
                            <TouchableOpacity onPress={() => setIsPinned(!isPinned)} style={styles.pinButton}>
                                <Icon raised type='material' size={12} color={'#000'} name={isPinned ? 'pan-tool' : 'do-not-touch'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setExpend(false)} style={{ position: 'absolute', top: 5, left: 5, zIndex: 30 }}>
                                <Icon type='material' size={22} color={'#fff'} name={"close-fullscreen"} />
                            </TouchableOpacity>
                            <Carousel
                                loop={controlCenter?.loop || false}
                                data={photos} style={{
                                    width: deviceWidth * 0.8
                                }}
                                autoPlay={controlCenter?.autoPlay || false}
                                // pagingEnabled={true}
                                snapEnabled={true}
                                width={deviceWidth * 0.8}
                                height={deviceHeight * 0.26}
                                renderItem={({ item, index }) => {
                                    return (
                                        <>
                                            <TouchableOpacity onPress={() => setUrlImage(item.photoPath)}
                                                style={{ zIndex: 10, position: 'absolute', top: 10, right: 10, backgroundColor: '#000', borderRadius: 20 }}>
                                                <Icon color={'#fff'} name='fullscreen' />
                                            </TouchableOpacity>
                                            <Image key={`${index}llpa`} style={{ borderRadius: 10 }}
                                                width={deviceWidth * 0.8} height={deviceHeight * 0.26}
                                                source={{ uri: item.photoPath }} />
                                        </>
                                    )
                                }}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setExpend(true)}
                            style={styles.minimizedContainer}>
                            <Icon name='fullscreen' size={16} color={'red'} reverse />
                        </TouchableOpacity>
                    )
                }
            </Animated.View>
            <Modal visible={urlImage == null ? false : true} style={{ flex: 1, backgroundColor: '#000' }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                    <TouchableOpacity onPress={() => setUrlImage(null)} style={{ alignSelf: 'flex-end', padding: 16 }}>
                        <Icon type={appConfig.ICON_TYPE} name='close' color={appColors.backgroundColor} />
                    </TouchableOpacity>
                    <WebView
                        style={{ width: deviceWidth, height: deviceHeight, backgroundColor: '#000' }}
                        cacheEnabled cacheMode="LOAD_CACHE_ELSE_NETWORK"
                        source={{ html: `<img src='${urlImage}'/>` }} />
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    unPin: {
        position: 'absolute',
        width: 50, // Kích thước khi thu gọn
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimizedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    pipContainer: {
        position: 'absolute',
        width: deviceWidth,
        height: deviceHeight * 0.28,
        borderRadius: 10,
        backgroundColor: '#333',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    pinButton: {
        color: '#fff',
        position: 'absolute',
        fontSize: 12,
        zIndex: 100,
        right: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
});
export default PiPControl;