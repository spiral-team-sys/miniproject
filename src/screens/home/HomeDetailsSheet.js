import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]
import useTheme from "../../hooks/useTheme";
import moment from "moment";
const HomeDetailsSheet = forwardRef((props, ref) => {
    const { appColors } = useTheme()
    const { data, ChartType, numColumn, Title } = props;
    // hooks
    const sheetRef = useRef(null);
    // variables
    const snapPoints = useMemo(() => ["25%", "50%", "88%"], []);
    // callbacks
    useImperativeHandle(ref, () => ({
        onShow: handleSnapPress,
        onClose: handleClosePress
    }))
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);
    // render
    const renderItemBySales = useCallback(({ item }) => {
        const textColor = item.isSuccess == 1 ? appColors.primaryColor : appColors.textColor
        const backgroundColor = item.isSuccess == 1 ? appColors.primaryColor : appColors.warningColor
        return (

            <View style={[styles.itemContainer, { alignItems: 'center', flexDirection: 'row', backgroundColor: appColors.cardColor }]}>
                <View style={{ backgroundColor: backgroundColor, width: 8, height: '100%', marginRight: 7, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}></View>
                <View style={[{
                    borderRadius: 12, marginRight: 3, padding: 7, flexGrow: 0.9
                }]}>
                    <Text style={{ color: textColor, fontWeight: '800', fontSize: 12 }}>
                        {item.Title}
                    </Text>
                    <View style={{ padding: 3, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 12, color: textColor, borderWidth: 0, marginEnd: 7 }}>{`${item.LabelTotal} ${item.Total}`}</Text>
                        <Text style={{ fontSize: 12, color: textColor, borderWidth: 0, marginEnd: 7 }}>{`${item.Label1} ${item.Value1}`}</Text>
                        <Text style={{ fontSize: 12, color: textColor, borderWidth: 0, marginEnd: 7 }}>{`${item.Label2} ${item.Value2}`}</Text>
                    </View>
                </View>
            </View >
        )
    }, []);
    const renderItemByStore = useCallback(({ item, index }) => {
        const groupDate = (index == 0 || item?.AuditDate != data[index - 1]?.AuditDate) ? item?.AuditDate : null

        return (
            <>
                {
                    groupDate !== null &&
                    <View style={{ marginLeft: 20, paddingTop: 20 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: appColors.textColor }}>{moment(item.AuditDate, "YYYYMMDD").format("dddd, DD MMMM YYYY")}</Text>
                    </View>
                }
                <View style={[styles.itemContainer, { alignItems: 'center', flexDirection: 'row', backgroundColor: appColors.borderColor }]}>
                    <View style={{
                        backgroundColor: item.Result == 'TC' ? appColors.primaryColor : appColors.errorColor, width: 8, height: '100%',
                        marginRight: 7, borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12
                    }}></View>
                    <View style={[{
                        borderRadius: 12, marginRight: 3, padding: 7, flexGrow: 0.8
                    }]}>
                        <Text style={{ color: appColors.textColor, fontWeight: '800', fontSize: 12 }}>
                            {item.ShopCode} - {item.ShopName}
                        </Text>
                        <Text style={{ fontSize: 10, fontWeight: '300', color: appColors.textColor }}>{item.Address}</Text>
                        <View style={{ padding: 3, alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: appColors.textColor, borderWidth: 0, marginEnd: 7, }}>
                                {`Kết quả ${item.Result}`} {item.AuditTime}
                            </Text>
                            <Text style={{ fontSize: 12, color: appColors.textColor, borderWidth: 0, marginEnd: 7 }}>
                                Loại hình {`${item.SubSegment}`}  {item.Priority}
                            </Text>
                            <Text style={{ width: '100%', fontStyle: 'italic', fontSize: 12, color: appColors.textColor, borderWidth: 0, marginEnd: 7, textAlign: 'right' }}>
                                Mã Sales {`${item.SpiralCode}`}
                            </Text>
                        </View>
                    </View>
                </View >
            </>
        )
    }, []);
    const styles = StyleSheet.create({
        itemContainer: {
            flexGrow: 1,
            margin: 6,
            borderRadius: 12,
        },
        contentContainer: {
            backgroundColor: appColors.backgroundColor
        }
    });
    return (
        <BottomSheet
            ref={sheetRef} backgroundStyle={{ backgroundColor: appColors.backgroundColor }}
            snapPoints={snapPoints}
            enablePanDownToClose
            index={-1}
            enableDynamicSizing={false}
            onChange={handleSheetChange}>
            <Text style={{ color: appColors.textColor, fontSize: 12, padding: 7 }}>{Title}</Text>
            <BottomSheetFlatList
                numColumns={numColumn}
                data={data}
                key={`${data.length}-k${numColumn}`}
                extraData={data}
                ListFooterComponent={<Text style={{ color: appColors.grayColor, textAlign: 'center', padding: 20, fontSize: 12 }}>Đã xem hết</Text>}
                keyExtractor={(i) => i.RowNum}
                renderItem={ChartType == 'bySales' ? renderItemBySales : renderItemByStore}
                contentContainerStyle={styles.contentContainer}
            />
        </BottomSheet>
    );
});

export default HomeDetailsSheet;