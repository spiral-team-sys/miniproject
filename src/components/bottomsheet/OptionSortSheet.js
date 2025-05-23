import React, { useState } from 'react'
import useTheme from '../../hooks/useTheme'
import ActionSheet from 'react-native-actions-sheet'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/themed'
import { KEYs } from '../../utils/storageKeys'

const OptionSortSheet = ({ dataMain = [], callback, searchData }) => {
    const { appColors } = useTheme()
    const [isChoose, setIsChoose] = useState('')

    const parseDate = (dateString) => {
        const [time, date] = dateString.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        const [day, month] = date.split("/").map(Number);
        return new Date(new Date().getFullYear(), month - 1, day, hours, minutes);
    };

    const onSortByTimeZtoA = (key) => {
        const dataSort = dataMain.sort((a, b) => parseDate(b.Uptodate) - parseDate(a.Uptodate));
        const search = searchData(dataSort);
        callback(search);
        setIsChoose(key)
    };

    const onSortByTimeAtoZ = (key) => {
        const dataSort = dataMain.sort((a, b) => parseDate(a.Uptodate) - parseDate(b.Uptodate));
        const search = searchData(dataSort);
        callback(search);
        setIsChoose(key)
    };

    const onSortByNameAtoZ = (key) => {
        const dataSort = dataMain.sort((a, b) => a.DocumentName.localeCompare(b.DocumentName));
        const search = searchData(dataSort)
        callback(search)
        setIsChoose(key)
    }

    const onSortByNameZtoA = (key) => {
        const dataSort = dataMain.sort((a, b) => b.DocumentName.localeCompare(a.DocumentName));
        const search = searchData(dataSort)
        callback(search)
        setIsChoose(key)
    }

    const styles = StyleSheet.create({
        containOption: { width: '100%', backgroundColor: appColors.lightColor, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
        textOption: {
            fontSize: 18, color: appColors.textColor, fontWeight: 'bold', textAlign: 'center',
            marginBottom: 16, paddingBottom: 12,
        },
        sortSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
        containSortOptions: { flexDirection: 'row', alignItems: 'center' },
        titleSortOptions: { fontSize: 16, color: appColors.textColor, fontWeight: '500' },
        sortButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 8, borderRadius: 20 },
        divider: { height: 1, backgroundColor: appColors.borderShadowColor, marginVertical: 4 },
        applyButton: { backgroundColor: appColors.primaryColor, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
        applyButtonText: { color: appColors.lightColor, fontWeight: 'bold', fontSize: 16 }
    })

    return (
        <ActionSheet
            id={KEYs.ACTION_SHEET.OPTION_SHEET}
            headerAlwaysVisible
            containerStyle={{ backgroundColor: appColors.lightColor, padding: 12 }}
        >

            <View style={styles.containOption}>
                <Text style={styles.textOption}>{'Sắp xếp'}</Text>
                <View style={styles.sortSection}>
                    <Text style={styles.titleSortOptions}>{'Theo tên'}</Text>
                    <View style={styles.containSortOptions}>
                        <TouchableOpacity style={{ ...styles.sortButton, backgroundColor: isChoose === 'NAME_ZTOA' ? appColors.borderColor : appColors.lightColor, }} onPress={() => onSortByNameZtoA('NAME_ZTOA')}>
                            <Icon name='sort-desc' type={'octicon'} color={appColors.darkColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.sortButton, backgroundColor: isChoose === 'NAME_ATOZ' ? appColors.borderColor : appColors.lightColor, }} onPress={() => onSortByNameAtoZ('NAME_ATOZ')}>
                            <Icon name='sort-asc' type={'octicon'} color={appColors.darkColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.sortSection}>
                    <Text style={styles.titleSortOptions}>{'Theo thời gian'}</Text>
                    <View style={styles.containSortOptions}>
                        <TouchableOpacity style={{ ...styles.sortButton, backgroundColor: isChoose === 'TIME_ZTOA' ? appColors.borderColor : appColors.lightColor, }} onPress={() => onSortByTimeZtoA('TIME_ZTOA')}>
                            <Icon name='sort-desc' type={'octicon'} color={appColors.darkColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.sortButton, backgroundColor: isChoose === 'TIME_ATOZ' ? appColors.borderColor : appColors.lightColor, }} onPress={() => onSortByTimeAtoZ('TIME_ATOZ')}>
                            <Icon name='sort-asc' type={'octicon'} color={appColors.darkColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ActionSheet>
    )
}
export default OptionSortSheet