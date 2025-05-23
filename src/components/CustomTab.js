import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Loading from "./Loading";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import { fontWeightBold, minWidthTab } from "../utils/utility";
import { deviceHeight, deviceWidth } from "../styles/styles";
import _ from "lodash";

const CustomTab = ({ keyTabName = 'ItemName', data = [], appColors, scrollEnabled = true, renderItem, onTabChange }) => {
    const [dataTab, setDataTab] = useState([])
    const [isLoading, setLoading] = useState(true)
    //
    useEffect(() => {
        const LoadData = () => {
            const tabList = _.uniqBy(data, keyTabName)
            setDataTab(tabList)
            setLoading(false)
        }
        LoadData()
    }, [data])

    const styles = StyleSheet.create({
        viewTabContainer: { width: '100%', height: '100%' },
        contentDataMain: { width: deviceWidth, height: deviceHeight, paddingTop: 40, zIndex: 1 },
        labelName: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.primaryColor },
        labelStyle: { fontSize: 13, fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: appColors.primaryColor },
        tabStyle: { backgroundColor: appColors.backgroundColor, minWidth: minWidthTab(dataTab), height: 38 }
    })

    const renderItemTab = () => {
        return dataTab.map((item, index) => {
            return (
                <Tabs.Tab key={index} label={item[keyTabName]} name={item[keyTabName]} >
                    <View style={styles.contentDataMain}>
                        {renderItem ? renderItem(item, index) : null}
                    </View>
                </Tabs.Tab>
            )
        })
    }

    if (data == null || data.length == 0)
        return <View />
    if (isLoading)
        return <Loading isLoading={true} color={appColors.primaryColor} />
    return (
        <View style={styles.viewTabContainer}>
            <Tabs.Container
                pagerProps={{
                    scrollEnabled: scrollEnabled,
                    keyboardShouldPersistTaps: 'handled'
                }}
                onTabChange={onTabChange || null}
                renderTabBar={props => (
                    <MaterialTabBar
                        {...props}
                        scrollEnabled
                        labelStyle={styles.labelStyle}
                        indicatorStyle={styles.indicatorStyle}
                        inactiveColor={appColors.unselectColor}
                        activeColor={appColors.primaryColor}
                        tabStyle={styles.tabStyle}
                    />
                )}>
                {renderItemTab()}
            </Tabs.Container>
        </View>
    )
}

export default CustomTab;