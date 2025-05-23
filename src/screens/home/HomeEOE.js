import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MENU_CONTROLLER } from "../../controllers/MenuController";
import { Avatar, Divider, Icon } from "@rneui/base";
import { useSharedValue } from 'react-native-reanimated';
import { deviceWidth } from "../../styles/styles";
import useTheme from "../../hooks/useTheme";
import SyncData from "../../components/SyncData";
import useAuth from "../../hooks/useAuth";
import { fontWeightBold } from "../../utils/utility";
import appConfig from "../../utils/appConfig/appConfig";
import { DASHBOARD_API } from "../../services/dashboardApi";
import { useDispatch } from "react-redux";
import { setMenuHome } from "../../redux/actions";
import { toastError } from "../../utils/configToast";
import HomeDetailsSheet from "./HomeDetailsSheet";
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const HomeEOE = ({ props }) => {
    const { navigation } = props
    const { appColors } = useTheme()
    const { userInfo } = useAuth()
    const [menu, setMenuList] = useState([])
    const refSheet = useRef()
    const [dashboard, setDashboard] = useState([])
    const [chartType, setChartType] = useState(null);
    const [title, setTitle] = useState(null);
    const [chartDetail, setDetails] = useState([])
    const progress = useSharedValue(0);
    const dispatch = useDispatch()
    const refSync = useRef()
    const ref = useRef(null);
    //
    const fisrtLoad = async () => {
        await DASHBOARD_API.DashboardTop(setDashboard)
        await MENU_CONTROLLER.GetDataMenuHome(setMenuList)
    }
    const onRefreshData = async () => {
        await DASHBOARD_API.DashboardTop(setDashboard)
        await refSync?.current?.onSyncData()
    }
    const handlerMenuPress = (item) => {
        dispatch(setMenuHome(item))
        navigation.navigate(item.pageName)
    }
    //
    useEffect(() => {
        fisrtLoad()
    }, [userInfo])
    // View
    const styles = StyleSheet.create({
        mainContainer: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 30 },
        contentMain: { flex: 1, backgroundColor: appColors.primaryColor, padding: 8 },
        contentHeader: { width: '100%' },
        badgeView: { flexDirection: 'row', justifyContent: 'center', },
        itemMain: { backgroundColor: appColors.backgroundColor },
        buttonMenu: { flexDirection: 'row', flex: 1, padding: 8, alignItems: 'center' },
        contentTitle: { flexGrow: 1, padding: 3, marginLeft: 8, justifyContent: 'center' },
        titleName: { fontWeight: fontWeightBold, color: appColors.textColor, fontSize: 13 },
        subTitleName: { color: appColors.textColor, fontSize: 11 },
        itemCardMain: { width: deviceWidth, height: 210, marginTop: 3, justifyContent: 'center', borderRadius: 20, },
        titleItemCard: { fontSize: 12, color: appColors.textColor },
        contentCard: { paddingVertical: 10 },
        contentHeaderCard: {
            borderWidth: 0.5, borderColor: appColors.borderColor, marginLeft: 16,
            backgroundColor: appColors.cardColor, padding: 7, position: 'absolute', top: -16,
            borderRadius: 20, alignItems: 'center', alignContent: 'center'
        },
        titleHeadCard: { textAlignVertical: 'bottom', fontWeight: '700', fontSize: 13, color: appColors.primaryColor },
        contentItemMain: { margin: 7, padding: 8, borderRadius: 20 },
        dotContainer: { gap: 5, marginTop: 10 },
        dotStyle: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50 },
    })
    const CardView = ({ item, index }) => {
        const rowData = JSON.parse(item?.chartData || "[]")
        const onShowDetails = async () => {
            const details = await item.details !== null ? JSON.parse(item.details) : []
            if (details.length > 0) {
                await setDetails(details)
                await setChartType(item.chartType)
                await setTitle(item.title)
                await refSheet.current.onShow(1)
            } else {
                toastError("Không có dữ liệu chi tiết")
            }
        }
        return (
            <TouchableOpacity onPress={onShowDetails} key={`dds${index}lo1`}
                style={{
                    width: deviceWidth * 0.8, // Độ rộng của mỗi item (80% màn hình)
                    borderRadius: 8, padding: 0,
                }}>
                <View style={{ ...styles.itemCardMain, backgroundColor: appColors.backgroundColor }} >
                    <View style={styles.contentHeaderCard}>
                        <Text style={styles.titleHeadCard}>{item.title}</Text>
                    </View>
                    <View style={styles.contentCard}>
                        {
                            rowData.map((row, i) => {
                                return (
                                    <View key={`${index}kl${i}lq`}>
                                        <View style={{ ...styles.contentItemMain, flexDirection: 'row' }}>
                                            <Text style={{ ...styles.titleItemCard, color: appColors.textColor, flexGrow: 1, }}>
                                                {row.name}
                                            </Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: appColors.textColor }}>{row.quantity}</Text>
                                        </View>
                                        <Divider />
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const HeaderList = () => {
        return (
            <>
                <View style={styles.contentHeader}>
                    <Carousel style={{ alignContent: 'center', alignItems: 'center' }}
                        loop
                        height={230}
                        ref={ref}
                        autoPlayInterval={2000}
                        pagingEnabled={true}
                        mode="parallax"
                        snapEnabled={true}
                        width={deviceWidth}
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50,
                        }}
                        onProgressChange={progress}
                        // autoPlay={true}
                        data={dashboard}
                        // scrollAnimationDuration={2000}
                        // onSnapToItem={(index) => console.log(index)}
                        renderItem={CardView}
                    />
                    <Pagination.Basic
                        key={"RowNum"}
                        progress={progress}
                        data={dashboard}
                        dotStyle={styles.dotStyle}
                        containerStyle={styles.dotContainer}
                    />
                </View>
                <Text style={{ color: appColors.backgroundColor, fontSize: 12, marginLeft: 30, marginBottom: 12 }}>Chức năng</Text>
            </>
        )
    }
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            handlerMenuPress(item)
        }
        const borderValue = index == 0 ? 30 : 0
        return (
            <View key={`home_item_${index}`} style={{ ...styles.itemMain, borderTopLeftRadius: borderValue, borderTopRightRadius: borderValue }}>
                <TouchableOpacity onPress={onPress} style={styles.buttonMenu}>
                    <Icon reverse color={appColors.primaryColor} type={item.iconType || appConfig.ICON_TYPE} name={item.iconName} />
                    <View style={styles.contentTitle}>
                        <Text style={styles.titleName}>{item.menuNameVN}</Text>
                        <Text style={styles.subTitleName}>{item.menuName}</Text>
                    </View>
                    <Icon color={appColors.primaryColor} size={16} type={appConfig.ICON_TYPE} name="chevron-forward" />
                </TouchableOpacity>
                <Divider />
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <SyncData onCompleted={fisrtLoad} ref={refSync} />
            <View style={{ backgroundColor: appColors.primaryColor, padding: 19, flexDirection: 'row' }}>
                <Avatar rounded size={"medium"} source={{ uri: 'https://apps.spiral.com.vn/eoe/logo.png' }} />
                <View style={{ padding: 7, alignContent: 'center', marginLeft: 12 }}>
                    <Text style={{ color: appColors.backgroundColor, fontWeight: '800' }}>Welcome, {userInfo?.employeeName}</Text>
                    <Text style={{ color: appColors.backgroundColor, fontStyle: 'italic', fontSize: 12 }}>{userInfo?.loginName} ({userInfo?.employeeId})</Text>
                </View>
            </View>
            <View style={styles.contentMain}>
                <FlashList
                    data={menu}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HeaderList />}
                    renderItem={renderItem}
                    estimatedItemSize={50}
                    refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshData} />}
                />
            </View>
            <HomeDetailsSheet
                ref={refSheet}
                data={chartDetail}
                Title={title}
                numColumn={chartType === 'bySales' ? 2 : 1}
                ChartType={chartType} />
        </View>
    )
}
export default HomeEOE;