import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { fontWeightBold, weekdays } from "../../utils/utility";
import { Icon, Text } from "@rneui/themed";
import { deviceWidth } from "../../styles/styles";
import { isValidData } from "../../utils/validateData";
import appConfig from "../../utils/appConfig/appConfig";
import _ from 'lodash';

const WeekView = ({ data = [], onChooseDay, isRefreshData = false }) => {
    const { appColors } = useTheme();
    const [dataByDay, setDataByDay] = useState({});
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [slideAnim] = useState(new Animated.Value(0));

    const loadData = () => {
        if (isValidData(data)) {
            const todayData = data.flatMap((week) => {
                const days = JSON.parse(week.jsonWeek);
                return days.filter((day) => day.isToday === 1);
            });
            handleChooseDay(todayData[0] || {})
            const todayWeekIndex = data.findIndex((week) => JSON.parse(week.jsonWeek).some((day) => day.isToday === 1));
            setCurrentWeekIndex(todayWeekIndex >= 0 ? todayWeekIndex : 0);
        }
    };

    const handleChooseDay = (item) => {
        setDataByDay(item);
        onChooseDay && onChooseDay(item);
    };

    const showNext = () => {
        if (currentWeekIndex < data.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
            animateWeekChange();
        }
    };
    const showPrevious = () => {
        if (currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
            animateWeekChange();
        }
    };

    const animateWeekChange = () => {
        slideAnim.setValue(0);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        loadData();
        return () => { isMounted = false }
    }, [data, isRefreshData]);

    const styles = StyleSheet.create({
        mainContainer: { backgroundColor: appColors.backgroundColor, paddingHorizontal: 8 },
        headerCalendar: { flexDirection: 'row', justifyContent: 'center', padding: 8 },
        mainHeader: { width: (deviceWidth - 8) / 7, alignItems: 'center' },
        titleCalendar: { fontSize: 12, fontWeight: fontWeightBold },
        contentDayInWeek: { overflow: 'hidden', borderWidth: 1, borderColor: appColors.borderColor, borderRadius: 5 },
        mainDays: { width: (deviceWidth - 8) / 7, minHeight: (deviceWidth - 8) / 7, padding: 8, alignItems: 'center' },
        headerDays: { flexDirection: 'row' },
        titleDays: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
        weekContainer: { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }) }], borderBottomWidth: 1, borderBottomColor: appColors.borderColor },
        titlePrevious: { fontSize: 13, fontWeight: '500', color: currentWeekIndex === 0 ? appColors.disabledColor : appColors.textColor, paddingHorizontal: 8 },
        titleNext: { fontSize: 13, fontWeight: '500', color: currentWeekIndex === data.length - 1 ? appColors.disabledColor : appColors.textColor, paddingHorizontal: 8 },
        mainHeaderWeek: { width: '100%' },
        contentHeaderAction: { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', padding: 8 },
        titleCalendarCenter: { flex: 1, fontSize: 14, fontWeight: 'bold', color: appColors.textColor, textAlign: 'center' },
        titleMode: { fontSize: 12, fontWeight: '500', padding: 8, paddingBottom: 0, textAlign: 'right', fontStyle: 'italic', color: appColors.linkColor },
        contentSummaryValue: { width: 24, height: 24, borderRadius: 24, marginTop: 5, backgroundColor: appColors.primaryColor, alignItems: 'center', justifyContent: 'center', },
        titleTotalValue: { fontSize: 11, fontWeight: fontWeightBold, color: appColors.lightColor, textAlign: 'center' }
    });

    const renderHeaderWeekDay = () => (
        <View style={styles.mainHeaderWeek}>
            <View style={styles.contentHeaderAction}>
                <Icon
                    type={appConfig.ICON_TYPE}
                    name="caret-back-circle"
                    color={currentWeekIndex === 0 ? appColors.disabledColor : appColors.primaryColor}
                    size={32}
                    disabled={currentWeekIndex === 0}
                    disabledStyle={{ backgroundColor: 'transparent' }}
                    onPress={showPrevious}
                />
                <Text style={styles.titleCalendarCenter}>{`Tuần ${data[currentWeekIndex]?.weekByYear || ''} - ${data[currentWeekIndex]?.titleName || 'Tháng'}`}</Text>
                <Icon
                    type={appConfig.ICON_TYPE}
                    name="caret-forward-circle"
                    color={currentWeekIndex === data.length - 1 ? appColors.disabledColor : appColors.primaryColor}
                    size={32}
                    disabled={currentWeekIndex === data.length - 1}
                    disabledStyle={{ backgroundColor: 'transparent' }}
                    onPress={showNext}
                />
            </View>
            <View style={styles.headerCalendar}>
                {weekdays.map((item, index) => (
                    <View key={`weekday_${index}`} style={styles.mainHeader}>
                        <Text style={[styles.titleCalendar, { color: item.dayOfWeek === 0 ? appColors.errorColor : appColors.subTextColor }]}>
                            {item.weekDayName}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
    const renderWeeks = () => (
        <View style={{ width: '100%', alignItems: 'center' }}>
            {isValidData(data) &&
                data.map((item, index) => (
                    <Animated.View
                        key={`week_${index}`}
                        style={[
                            styles.weekContainer,
                            { display: index !== currentWeekIndex ? "none" : "flex" },
                            { borderBottomWidth: (index + 1) == data.length ? 0 : 1 }
                        ]}
                    >
                        {renderDays(JSON.parse(item.jsonWeek || '[]'))}
                    </Animated.View>
                ))}
        </View>
    );
    const renderDays = (data) => (
        <View style={styles.headerDays}>
            {weekdays.map((weekday, index) => {
                const itemDay = _.find(data, { DayOfWeek: weekday.dayOfWeek }) || {};
                const isChoose = itemDay.DayValue !== undefined && dataByDay.DayValue === itemDay.DayValue;
                const handleDayPress = () => {
                    itemDay.DayValue && handleChooseDay(itemDay);
                };
                const dayStyle = [
                    styles.mainDays,
                    {
                        backgroundColor: isChoose ? appColors.tertiaryColor : appColors.backgroundColor,
                        borderEndWidth: (index + 1) === weekdays.length ? 0 : 1,
                        borderEndColor: appColors.borderColor,
                    },
                ];

                return (
                    <TouchableOpacity key={`day_${index}`} style={dayStyle} onPress={handleDayPress}>
                        <Text style={[
                            styles.titleDays, {
                                color: weekday.dayOfWeek === 0 ? appColors.errorColor : appColors.textColor,
                                fontWeight: itemDay.isToday == 1 ? 'bold' : '500',
                                fontStyle: itemDay.isToday == 1 ? 'italic' : 'normal'
                            }]}>
                            {itemDay.DayValue}
                        </Text>
                        <View style={{ ...styles.contentSummaryValue, backgroundColor: itemDay.TotalValue > 0 ? appColors.primaryColor : appColors.disabledColor }}>
                            <Text style={styles.titleTotalValue}>{itemDay.TotalValue || 0}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
    return (
        <View style={styles.mainContainer}>
            {renderHeaderWeekDay()}
            <View style={styles.contentDayInWeek}>{renderWeeks()}</View>
        </View>
    );
};

export default WeekView;
