import moment from "moment";
import DeviceInfo from "react-native-device-info";
import AppleHealthKit from 'react-native-health'
import { getSdkStatus, initialize, readRecords, requestPermission, SdkAvailabilityStatus } from "react-native-health-connect";


export const initializeDeviceInfo = async (actionResult) => {
    try {
        const getBatteryLevel = await DeviceInfo.getBatteryLevel() * 100 | 0
        const deviceInfo = {
            deviceId: await DeviceInfo.getUniqueId(),
            powerState: await DeviceInfo.getPowerState(),
            getApiLevel: await DeviceInfo.getApiLevel(),
            getAndroidId: await DeviceInfo.getAndroidId(),
            getApplicationName: await DeviceInfo.getApplicationName(),
            getBatteryLevel: getBatteryLevel + "%",
            getBrand: await DeviceInfo.getBrand(),
            getBuildNumber: await DeviceInfo.getBuildNumber(),
            getBundleId: await DeviceInfo.getBundleId(),
            isCameraPresent: await DeviceInfo.isCameraPresent(),
            getCarrier: await DeviceInfo.getCarrier(),
            getDeviceId: await DeviceInfo.getDeviceId(),
            getDeviceName: await DeviceInfo.getDeviceName(),
            getFirstInstallTime: await moment(DeviceInfo.getFirstInstallTime()),
            getLastUpdateTime: await moment(DeviceInfo.getLastUpdateTime()),
            getManufacturer: await DeviceInfo.getManufacturer(),
            getModel: await DeviceInfo.getModel(),
            getSystemName: await DeviceInfo.getSystemName(),
            getSystemVersion: await DeviceInfo.getSystemVersion(),
            getVersion: await DeviceInfo.getVersion(),
            isAirplaneMode: await DeviceInfo.isAirplaneMode(),
            isLocationEnabled: await DeviceInfo.isLocationEnabled(),
            getSerialNumber: await DeviceInfo.getSerialNumber(),
            getAvailableLocationProviders: await DeviceInfo.getAvailableLocationProviders(),
            getFreeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
            getIpAddress: await DeviceInfo.getIpAddress(),
            getInstallerPackageName: await DeviceInfo.getInstallerPackageName(),
            getMaxMemory: await DeviceInfo.getMaxMemory(),
            getTotalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
            getTotalMemory: await DeviceInfo.getTotalMemory(),
            getUsedMemory: await DeviceInfo.getUsedMemory(),
            isLandscape: await DeviceInfo.isLandscape(),
            isHeadphonesConnected: await DeviceInfo.isHeadphonesConnected(),
            isEmulator: await DeviceInfo.isEmulator()
        }
        actionResult && actionResult(deviceInfo)
        return deviceInfo
    } catch (e) {
        console.log("Lỗi lấy thông tin thiết bị:", e);
    }
}

export const initializeHealthData = async () => {
    try {
        const optionsWeekly = {
            startDate: moment().startOf('isoWeek').startOf('day').toISOString(),
            endDate: moment().endOf('isoWeek').endOf('day').toISOString(),
            includeManuallyAdded: true,
        };
        const permissions = {
            permissions: {
                read: [
                    AppleHealthKit.Constants.Permissions.Steps,
                    AppleHealthKit.Constants.Permissions.ActivitySummary,
                    AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
                    AppleHealthKit.Constants.Permissions.AppleStandTime,
                    AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
                    AppleHealthKit.Constants.Permissions.HeartRate,
                    AppleHealthKit.Constants.Permissions.RunningSpeed,
                    AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
                ],
            },
        };
        await new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(permissions, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        const stepDaily = await new Promise((resolve, reject) => {
            AppleHealthKit.getDailyStepCountSamples(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err);
                }
                const dataStep = []
                for (let i = 0; i < results.length; i++) {
                    if (results[i].startDate == results[0].startDate) {
                        dataStep.push(results[i])
                    }
                }
                resolve(dataStep);
            });
        });
        const activeEnergy = await new Promise((resolve, reject) => {
            AppleHealthKit.getActiveEnergyBurned(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        const activitySum = await new Promise((resolve, reject) => {
            AppleHealthKit.getActivitySummary(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        const standTime = await new Promise((resolve, reject) => {
            AppleHealthKit.getAppleStandTime(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        const distanceWalkRunning = await new Promise((resolve, reject) => {
            AppleHealthKit.getDailyDistanceWalkingRunningSamples(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err)
                }
                resolve(results)
            })
        })
        const heartRate = await new Promise((resolve, reject) => {
            AppleHealthKit.getHeartRateSamples(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err)
                }
                resolve(results)
            })
        })
        const heartRateWalkingAvg = await new Promise((resolve, reject) => {
            AppleHealthKit.getWalkingHeartRateAverage(optionsWeekly, (err, results) => {
                if (err) {
                    return reject(err)
                }
                resolve(results)
            })
        })
        return {
            stepDaily,
            activeEnergy,
            activitySum,
            standTime,
            distanceWalkRunning,
            heartRate,
            heartRateWalkingAvg
        };
    } catch (error) {
        console.error("Error initializing HealthKit data:", error);
        return null;
    }
};

export const initialHealthConnect = async () => {
    // const isInitialized = await initialize();
    // const status = await getSdkStatus();
    // if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    //     console.log('SDK is available');
    // } else if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
    //     console.log('SDK is not available');
    // } else if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    //     console.log('SDK is not available, provider update required');
    // }

    // await requestPermission([
    //     { accessType: 'read', recordType: 'HeartRate' },
    //     { accessType: 'read', recordType: 'Steps' },
    //     { accessType: 'read', recordType: 'Speed' },
    //     { accessType: 'read', recordType: 'RestingHeartRate' },
    //     { accessType: 'read', recordType: 'ExerciseSession' },
    //     { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
    // ]);

    // const today = new Date();
    // const startTime = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    // const endTime = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // try {
    //     const [steps, heartRate, speed, calories] = await Promise.all([
    //         readRecords('Steps', { timeRangeFilter: { operator: 'between', startTime, endTime } }),
    //         readRecords('HeartRate', { timeRangeFilter: { operator: 'between', startTime, endTime } }),
    //         readRecords('Speed', { timeRangeFilter: { operator: 'between', startTime, endTime } }),
    //         readRecords('ActiveCaloriesBurned', { timeRangeFilter: { operator: 'between', startTime, endTime } }),
    //     ]);

    //     const data = [{
    //         steps: steps.records,
    //         heartRate: heartRate.records,
    //         speed: speed.records,
    //         calories: calories.records,
    //     }];

    //     return data;
    // } catch (error) {
    //     console.error('Error retrieving records:', error);
    //     return [];
    // }
};


