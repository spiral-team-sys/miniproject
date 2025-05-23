import React from 'react';
import { Icon, Text } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/settings/SettingsScreen';
import appConfig, { brsApp } from '../utils/appConfig/appConfig';
import HomeScreen from '../screens/home/HomeScreen';
import useTheme from '../hooks/useTheme';
import NotificationScreen from '../screens/notification/NotificationScreen';
import { Platform, StyleSheet, View } from 'react-native';
import TodayScreen from '../screens/TodayScreen';
import useNotificationManager from '../hooks/useNotificationManager';

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
    const { appColors } = useTheme()
    const { countNotification } = useNotificationManager()
    // 
    const styles = StyleSheet.create({
        tabBarStyle: { minHeight: 66, alignItems: 'center', justifyContent: 'center', backgroundColor: appColors.primaryColor, borderTopWidth: 1, borderTopColor: appColors.borderColor },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', position: 'absolute', bottom: 0 },
        tabBarIconStyle: { size: 24, paddingVertical: 5 },
        tabIconMain: { alignItems: 'center' },
        badgeCountView: { width: 20, height: 20, position: 'absolute', top: -6, end: -8, zIndex: 1, backgroundColor: appColors.errorColor, borderWidth: 1, borderColor: appColors.lightColor, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
        titleCount: { fontSize: 11, fontWeight: '500', color: appColors.lightColor }
    })
    //
    const tabBarIcon = ({ focused, color, size }, route) => {
        let iconName = "list";
        var iconType = appConfig.ICON_TYPE
        switch (route.name) {
            case "home":
                iconName = focused ? 'home' : 'home-outline';
                break;
            case "today":
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
            case "notify":
                iconName = focused ? 'notifications' : 'notifications-outline';
                break;
            case "setting":
                iconName = focused ? 'settings' : 'settings-outline';
                break;
            default:
                iconName = "list"
                break;
        }
        return (
            <View style={styles.tabIconMain}>
                {route.name == 'notify' && countNotification > 0 &&
                    <View style={styles.badgeCountView}>
                        <Text style={styles.titleCount}>{countNotification}</Text>
                    </View>
                }
                <Icon type={iconType} name={iconName} size={size} color={color} />
            </View>
        )
    }
    const TabBarLabel = ({ label, color }) => (
        <Text style={{ ...styles.tabBarLabelStyle, color }}>{label}</Text>
    );
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: (props) => tabBarIcon(props, route),
                tabBarActiveTintColor: appColors.whiteColor,
                tabBarInactiveTintColor: appColors.disabledColor,
                tabBarStyle: styles.tabBarStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
                tabBarIconStyle: styles.tabBarIconStyle,
                headerShown: false
            })}>
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{ tabBarLabel: ({ color }) => <TabBarLabel label="Trang chủ" color={color} /> }}
            />
            {![brsApp].includes(appConfig.APPID) &&
                <Tab.Screen
                    name="today"
                    component={TodayScreen}
                    options={{ tabBarLabel: ({ color }) => <TabBarLabel label="Hôm nay" color={color} /> }}
                />
            }
            <Tab.Screen
                name="notify"
                component={NotificationScreen}
                options={{ tabBarLabel: ({ color }) => <TabBarLabel label="Thông báo" color={color} /> }}
            />
            <Tab.Screen
                name="setting"
                component={SettingsScreen}
                options={{ tabBarLabel: ({ color }) => <TabBarLabel label="Tài khoản" color={color} /> }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
