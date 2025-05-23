import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { Text } from "@rneui/base";
import moment from "moment";

const DateChoose = ({ value, disabled = false, onChooseDate, containerStyle }) => {
    const { appColors } = useTheme();
    const [isOpen, setOpen] = useState(false);
    const [dateValue, setDateValue] = useState(new Date());

    const handlerChange = () => {
        setOpen(true);
    }

    const handlerChooseDate = (date) => {
        setDateValue(date);
        onChooseDate && onChooseDate(moment(date).format('MM-YYYY'))
        setOpen(false)
    }

    const handlerCancel = () => {
        setOpen(false)
    }

    useEffect(() => { }, [])

    const styles = StyleSheet.create({
        mainContainer: { flex: 1, borderRadius: 5, borderColor: appColors.borderColor, borderWidth: 1, backgroundColor: appColors.backgroundColor, padding: 8, margin: 8, marginEnd: 0 },
        titleView: { textAlign: 'center', fontWeight: '500', fontSize: 12, color: appColors.darkColor }
    });

    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={handlerChange} style={styles.mainContainer} disabled={disabled}>
                <Text style={styles.titleView}>{value || 'Chọn ngày'}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                theme="dark"
                mode="date"
                open={isOpen}
                date={dateValue}
                onConfirm={handlerChooseDate}
                onCancel={handlerCancel}
            />
        </View>
    );
}

export default DateChoose;