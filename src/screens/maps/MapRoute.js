import { useEffect, useRef, useState, useCallback } from 'react';
import { DeviceEventEmitter, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SHOP_API } from '../../services/shopApi';
import { toastError, toastInfo, toastSuccess } from '../../utils/configToast';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering';
import { setShopInfo } from "../../redux/actions";
import { KEYs } from '../../utils/storageKeys';
import { fontWeightBold, initialRegionDefault } from '../../utils/utility';
import { isValidData } from '../../utils/validateData';
import useTheme from '../../hooks/useTheme';
import Geolocation from 'react-native-geolocation-service';
import Button from '../../components/button/Button';
import { checkAndRequestPermission, LOCATION_PERMISSION } from '../../utils/permissions';
import ItemMarker from '../../components/items/ItemMarker';
import ShopInfoSheet from '../../components/bottomsheet/ShopInfoSheet';
import LottieView from 'lottie-react-native';
import { deviceHeight, deviceWidth } from '../../styles/styles';
import { alertConfirm } from '../../utils/helper';
import { Icon } from '@rneui/themed';
import appConfig from '../../utils/appConfig/appConfig';
import GroupData from '../../components/GroupData';
import SearchData from '../../components/SearchData';
import _ from 'lodash';

const _MapRoute = ({ navigation }) => {
    const { appColors } = useTheme();
    const { statusInfo } = useSelector(state => state.status);
    const [loading, setLoading] = useState(false);
    const [doing, setDoing] = useState(0);
    const [SRID, setSRID] = useState(0);
    const [shoplist, setShopList] = useState([]);
    const [dataMainSRID, setDataMainSRID] = useState([]);
    const [dataSRID, setDataSRID] = useState([]);
    const [shopinfo, setShop] = useState({});
    const [initialRegion, setInitialRegion] = useState(initialRegionDefault);
    const mapRef = useRef();
    const bottomSheetRef = useRef(null);
    const dispatch = useDispatch();
    //
    const LoadData = async () => {
        await SHOP_API.GetDataSRID((mData, message) => {
            message && toastError('Thông báo', message)
            setDataSRID(mData)
            setDataMainSRID(mData)
        })
    }
    const getNear = useCallback(async () => {
        setLoading(true);
        const isPermission = await requestLocationPermission();
        if (isPermission) {
            Geolocation.getCurrentPosition(
                async position => {
                    const { latitude, longitude } = position.coords;
                    const region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    };
                    mapRef.current?.animateToRegion(region, 1000);
                    await SHOP_API.GetNearShop(latitude, longitude, SRID, async result => {
                        setShopList(result);
                        if (result.length > 0) {
                            const shop = result[0];
                            const shopRegion = {
                                latitude: shop.latitude,
                                longitude: shop.longitude,
                                latitudeDelta: 0.03,
                                longitudeDelta: 0.03,
                            };
                            mapRef.current?.animateToRegion(shopRegion, 1000);
                        }
                        toastSuccess(result.length === 0 ? 'Không tìm thấy cửa hàng nào gần bạn' : `Đã tìm thấy ${result.length} cửa hàng gần bạn`);
                        setLoading(false);
                    });
                },
                () => {
                    toastError('Lỗi vị trí', 'Không thể lấy vị trí. Vui lòng thử lại.');
                    setLoading(false);
                }
            );
        } else {
            setLoading(false);
        }
    }, [SRID, requestLocationPermission]);
    const getMyLocation = useCallback(() => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                };
                setInitialRegion(region);
                mapRef.current?.animateToRegion(region, 1000);
            },
            error => {
                console.log(error);
                toastError('Lỗi', 'Không thể lấy vị trí của bạn. Vui lòng thử lại.');
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 50
            }
        );
    }, []);
    // Handler
    const onSearchData = (text) => {
        const dataSearch = _.filter(dataMainSRID, (e) => e.srid.toString().match(text))
        setDataSRID(dataSearch)
    }
    const handlerSearchByGroup = async (item, keyValue, isMultiple) => {
        const sridValue = item.keyValue == SRID ? 0 : item.keyValue
        setSRID(sridValue)
        //
        const listChooseGroup = _.map(dataMainSRID, (it, _idx) => {
            if (item.keyValue == it[keyValue])
                return { ...it, isChooseTag: it.isChooseTag == 1 ? 0 : 1 }
            else
                return isMultiple ? it : { ...it, isChooseTag: 0 }
        })
        await setDataMainSRID(listChooseGroup)
        await setDataSRID(listChooseGroup)
    }
    //   
    const requestLocationPermission = useCallback(async () => {
        const permissionGranted = await checkAndRequestPermission(LOCATION_PERMISSION);
        if (!permissionGranted) {
            toastError('Quyền bị từ chối', 'Ứng dụng cần quyền vị trí để tìm các cửa hàng gần bạn.');
        }
        return permissionGranted;
    }, []);

    const handlerPressSearch = useCallback(() => {
        if (isValidData(shoplist)) {
            alertConfirm('Thông báo', 'Bạn có muốn tìm kiếm lại danh sách cửa hàng gần nhất không?', getNear);
        } else {
            getNear();
        }
    }, [shoplist, getNear]);

    const checkStatus = useCallback(async (info) => {
        await SHOP_API.GetDoing(async (result) => {
            if (isValidData(result)) {
                const region = {
                    latitude: result[0].latitude,
                    longitude: result[0].longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                };
                mapRef.current?.animateToRegion(region, 1000);
                setShop(result[0]);
                setShopList(result);
                setDoing(1);
            } else {
                setShop({});
                setShopList([]);
                setDoing(0);
                getMyLocation();
            }
            if (info) {
                await SHOP_API.GetNearShop(info.latitude, info.longitude, setShopList);
            }
        });
    }, []);

    const onStartWork = useCallback(() => {
        if (statusInfo?.statusId === 0) {
            toastInfo('Bắt đầu làm việc', 'Vui lòng bấm bắt đầu làm việc trước khi khảo sát cửa hàng.');
        } else {
            dispatch(setShopInfo(shopinfo));
            bottomSheetRef.current?.close();
            navigation.navigate('Work');
        }
    }, [dispatch, navigation, shopinfo, statusInfo]);

    const onPressMarker = useCallback((item) => {
        dispatch(setShopInfo(item));
        setShop(item);
        if (bottomSheetRef.current && item.shopCode !== undefined) {
            bottomSheetRef.current.snapToIndex(0);
        }
    }, [dispatch]);

    //
    useEffect(() => {
        LoadData()
        checkStatus();
        requestLocationPermission();
        const reloadDataListener = DeviceEventEmitter.addListener(KEYs.DEVICE_EVENT.RELOAD_DOING, checkStatus);
        return () => {
            reloadDataListener.remove();
        };
    }, [getMyLocation, checkStatus, requestLocationPermission]);

    const styles = StyleSheet.create({
        container: { flex: 1 },
        contentMap: { flex: 0.85 },
        contentDoing: { position: 'absolute', bottom: 44, width: '100%', backgroundColor: appColors.cardColor, borderTopWidth: 1, borderTopColor: appColors.borderColor, },
        titleDoing: { padding: 8, paddingBottom: 0, color: appColors.errorColor, fontSize: 11, textAlign: 'center', fontWeight: fontWeightBold },
        loadingView: { zIndex: 1200, position: 'absolute', top: (deviceHeight * 0.5) - (deviceWidth * 0.39), left: 0, right: 0, alignItems: 'center', transform: [{ translateY: -100 }] },
        buttonStyle: Platform.OS === 'ios' && { padding: 12 },
        lottieView: { height: deviceWidth * 0.87, width: deviceWidth * 0.87 },
        groupView: { width: '100%', position: 'absolute', top: 0 },
        buttonMyLocation: {
            width: 54, height: 54, borderRadius: 54, position: 'absolute', bottom: 128, start: 8, backgroundColor: appColors.primaryColor, alignItems: 'center', justifyContent: 'center', zIndex: 0,
            shadowColor: appColors.shadowColor, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.3, elevation: 3
        },
        mainBottomAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }
    });

    return (
        <View style={styles.container}>
            <MapViewCluster
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsMyLocationButton
                loadingEnabled
                loadingIndicatorColor={appColors.primaryColor}
                showsCompass
                showsBuildings
                showsUserLocation
                showsTraffic
                mapPadding={styles.mapPadding}
                style={styles.contentMap}
                initialRegion={initialRegion || initialRegionDefault}
                clusterColor={appColors.errorColor}
                clusterTextColor={appColors.whiteColor}
                clusterBorderColor={appColors.errorColor}
                clusterBorderWidth={2}>
                {
                    shoplist.map((item, index) => {
                        if (item.latitude == null || item.longitude == null) return null;
                        const onPress = () => onPressMarker(item)
                        const colorMarker = item.colorMarker ? appColors[item.colorMarker] : item.isLockReport == 1 ? appColors.grayColor : appColors.errorColor;
                        return (
                            <Marker
                                key={index}
                                title={item.shopName}
                                description={item.address}
                                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                                pinColor={colorMarker}
                                onPress={onPress}
                            />
                        );
                    })
                }
            </MapViewCluster>
            {doing == 0 &&
                <View style={styles.groupView}>
                    <SearchData
                        placeholder={`Tìm kiếm - Tổng ${dataMainSRID.length} SRID`}
                        onSearchData={onSearchData}
                    />
                    <GroupData
                        dataMain={dataSRID}
                        keyName='srid'
                        keyValue='srid'
                        sumValueName='totalValue'
                        handlerChange={handlerSearchByGroup}
                    />
                </View>
            }
            {loading &&
                <View style={styles.loadingView}>
                    <LottieView autoPlay style={styles.lottieView} source={require('../../assets/lotties/nearby.json')} />
                </View>
            }
            <TouchableOpacity style={styles.buttonMyLocation} onPress={getMyLocation}>
                <Icon type={appConfig.ICON_TYPE} name='locate' size={24} color={appColors.lightColor} />
            </TouchableOpacity>
            <View style={styles.contentDoing}>
                <Text allowFontScaling={false} style={styles.titleDoing}>{doing == 0 ? `Nhấn tìm kiếm để tìm cửa hàng gần bạn` : `Đang kiểm tra ${shopinfo.shopName}`}</Text>
                <Button title={doing == 0 ? `Tìm cửa hàng` : `Tiếp tục làm việc`} onPress={doing == 0 ? handlerPressSearch : onStartWork} style={styles.buttonStyle} />
            </View>
            <ShopInfoSheet
                ref={bottomSheetRef}
                shopInfo={shopinfo}
                onStartWork={onStartWork}
                navigation={navigation} />
        </View>
    );
};

export default _MapRoute;
