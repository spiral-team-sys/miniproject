import React, { forwardRef, useEffect } from "react";
import { Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { deviceHeight } from "../../styles/styles";
import { isValidData } from "../../utils/validateData";
import { NoData } from "../errorPage/NoData";

const CustomListView = forwardRef((props, ref) => {
    const {
        renderItem,
        data,
        extraData,
        horizontal = false,
        numColumns = 1,
        ListHeader,
        bottomView,
        endView,
        showsVerticalScrollIndicator = false,
        isCheckData = false,
        onRefresh,
        scrollEnabled
    } = props
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        bottomView: { paddingBottom: deviceHeight / (Platform.OS == 'android' ? 4 : 3) },
        endView: { paddingEnd: 120 }
    })

    if (!isValidData(data)) return <NoData isCheckData={isCheckData} onRefresh={onRefresh} />

    if (horizontal)
        return (
            <FlashList
                ref={ref}
                horizontal
                keyExtractor={(_item, index) => index.toString()}
                data={data}
                extraData={[extraData]}
                renderItem={renderItem}
                estimatedItemSize={100}
                showsHorizontalScrollIndicator={showsVerticalScrollIndicator}
                snapToInterval={120}
                snapToAlignment="start"
                decelerationRate='fast'
                ListFooterComponent={<View style={[styles.endView, endView]} />}
                scrollEnabled={scrollEnabled}
            />
        )
    else
        return (
            <View style={styles.mainContainer}>
                <FlashList
                    ListHeaderComponent={ListHeader || null}
                    ref={ref}
                    keyExtractor={(_item, index) => index.toString()}
                    data={data}
                    extraData={[extraData]}
                    numColumns={numColumns}
                    estimatedItemSize={100}
                    renderItem={renderItem}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                    keyboardShouldPersistTaps='handled'
                    refreshControl={onRefresh && <RefreshControl refreshing={false} onRefresh={onRefresh} />}
                    ListFooterComponent={<View style={[styles.bottomView, bottomView]} />}
                    scrollEnabled={scrollEnabled}
                />
            </View>
        )
})

export default CustomListView;