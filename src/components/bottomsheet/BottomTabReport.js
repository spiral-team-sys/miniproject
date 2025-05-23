import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Text } from "@rneui/base";
import useTheme from "../../hooks/useTheme";

export const _index = {
    INPUT: 1, SUMMARY: 2, IMAGES: 3
}
export const BottomTabReport = ({ config, handlerChangePage }) => {
    const { appColors } = useTheme();
    const [pageIndex, setPageIndex] = useState(1)
    const [photoLength, setPhotoLength] = useState(0)

    const onPageInput = () => {
        setPageIndex(_index.INPUT)
        handlerChangePage(_index.INPUT)
    }

    const onPageImages = () => {
        setPageIndex(_index.IMAGES)
        handlerChangePage(_index.IMAGES)
    }
    useEffect(() => {
        return () => false
    }, [])
    const styles = StyleSheet.create({
        mainContainer: { backgroundColor: appColors.primaryColor, padding: 8, position: 'absolute', bottom: 24, start: 64, end: 64, borderRadius: 8 },
        mainBottom: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        pageButton: { width: `${parseInt(100 / Object.keys(config || {}).length)}%`, padding: 8, borderRadius: 5 },
        titlePage: { fontSize: 12, fontWeight: Platform.OS == 'ios' ? '600' : '700', textAlign: 'center' }
    })
    return (
        <View style={styles.mainContainer}>
            <View style={styles.mainBottom}>
                {config?.INPUT == 1 &&
                    <TouchableOpacity
                        key={_index.INPUT}
                        style={{ ...styles.pageButton, backgroundColor: pageIndex == _index.INPUT ? appColors.lightColor : appColors.primaryColor }}
                        onPress={onPageInput} >
                        <Text allowFontScaling={false} style={[styles.titlePage, { color: pageIndex == _index.INPUT ? appColors.primaryColor : appColors.whiteColor }]}>Nhập liệu</Text>
                    </TouchableOpacity>
                }
                {config?.IMAGES == 1 &&
                    <TouchableOpacity
                        key={_index.IMAGES}
                        style={{ ...styles.pageButton, backgroundColor: pageIndex == _index.IMAGES ? appColors.lightColor : appColors.primaryColor }}
                        onPress={onPageImages} >
                        <Text allowFontScaling={false} style={[styles.titlePage, { color: pageIndex == _index.IMAGES ? appColors.primaryColor : appColors.whiteColor }]}>Hình ảnh</Text>
                        {photoLength > 0 &&
                            <Badge
                                status="error"
                                textStyle={{ fontSize: 12, fontWeight: '700', color: appColors.lightColor }}
                                containerStyle={{ position: 'absolute', end: 5, top: 0 }}
                                value={photoLength}
                            />
                        }
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}