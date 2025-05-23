import React, { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { deviceWidth } from "../../styles/styles";
import { isValidData } from "../../utils/validateData";
import { DASHBOARD_API } from "../../services/dashboardApi";
import { toastError } from "../../utils/configToast";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import DailyDashboard from "./attendance/DailyDashboard";
import Loading from "../Loading";

const DashboardView = ({ navigation, isRefresh = false }) => {
    const { appColors } = useTheme();
    const [isLoading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const progress = useSharedValue(0);
    const progressDerived = useDerivedValue(() => progress.value);
    const ref = useRef();

    // Load data
    const LoadData = async () => {
        setLoading(true);
        try {
            await DASHBOARD_API.GetDashboardHome((mData, message) => {
                if (message) toastError(message);
                setDashboardData(mData);
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        LoadData();
    }, [isRefresh]);

    // Styles
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: appColors.cardColor, borderWidth: 1, borderRadius: 8, borderColor: appColors.borderColor, padding: 8 },
        contentItemSlide: { flex: 1 },
        activeDotStyle: { width: 8, height: 8, borderRadius: 8, backgroundColor: appColors.primaryColor },
        dotStyle: { width: 8, height: 8, borderRadius: 8, backgroundColor: appColors.darkColor },
        dotContainer: { gap: 5 },
    });

    // Render từng slide
    const renderSlideItem = ({ item, index }) => {
        if (!item) return null;

        let chartData = [];
        try {
            chartData = JSON.parse(item.chartData || "[]");
        } catch (error) {
            console.error("Error parsing chartData:", error);
        }

        if (item.pageName === "PageNumber") {
            return (
                <DailyDashboard
                    key={index}
                    data={chartData}
                    title={item.chartName}
                    pageDetail={item.pageDetail || "DashboardDetails"}
                    navigation={navigation}
                    disabled={isLoading}
                    onRefresh={LoadData}
                />
            );
        }
        return null;
    };

    // Nếu chưa có dữ liệu hoặc đang tải
    if (!isValidData(dashboardData) || isLoading) return <Loading isLoading={true} />;

    return (
        <View style={styles.mainContainer}>
            <Carousel
                ref={ref}
                loop={false}
                data={dashboardData}
                width={deviceWidth}
                height={210}
                renderItem={renderSlideItem}
                onProgressChange={(_offset, absoluteProgress) => { progress.value = absoluteProgress }}
            />
            <Pagination.Basic
                progress={progressDerived}
                data={dashboardData}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}
                containerStyle={styles.dotContainer}
            />
        </View>
    );
};

export default DashboardView;
