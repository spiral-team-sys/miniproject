import Geolocation from 'react-native-geolocation-service';
import { formatNumber } from '../helper';
import { Linking, Platform } from 'react-native';

const getCurrentLocation = (successCallback, errorCallback) => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
            const { mocked, timestamp } = position
            successCallback && successCallback({ latitude, longitude, accuracy, altitude, mocked, timestamp, speed, heading });
        },
        (error) => {
            errorCallback && errorCallback(error.message);
        },
        {
            enableHighAccuracy: false,
            timeout: 15000, // Thời gian tối đa để lấy vị trí (milisecond) - 15s
            maximumAge: 5000, // Thời gian cache vị trí cũ 
            distanceFilter: 50,// Cập nhật vị trí khi di chuyển tối thiểu 50m
            fastestInterval: 5000
        }
    );
};
const startWatchingPosition = (successCallback, errorCallback) => {
    const watchId = Geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            successCallback && successCallback({ latitude, longitude });
        },
        (error) => {
            errorCallback && errorCallback(error.message);
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 10, // Cập nhật vị trí khi di chuyển 10m
        }
    );
    return watchId;
};
const stopWatchingPosition = (watchId) => {
    if (watchId !== null) {
        Geolocation.clearWatch(watchId);
    }
};
//
const getDistance = (lat1 = 0, lon1 = 0, lat2 = 0, lon2 = 0) => {
    const R = 6371; // Bán kính Trái Đất (đơn vị: km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Khoảng cách theo đường chim bay (km)
    const distance = R * c;
    // Chuyển qua (m)
    const distanceInMeters = parseInt(distance * 1000)
    return distanceInMeters == 0 ? 0 : formatNumber(distanceInMeters, ',');
};
const openGoogleMapsDirections = (latitude, longitude) => {
    const url = Platform.select({
        ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
        android: `google.navigation:q=${latitude},${longitude}`
    });

    Linking.canOpenURL(url)
        .then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                const browser_url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                Linking.openURL(browser_url);
            }
        })
        .catch(err => console.error('An error occurred', err));
};
//
export const LOCATION_INFO = { getCurrentLocation, startWatchingPosition, stopWatchingPosition, getDistance, openGoogleMapsDirections }