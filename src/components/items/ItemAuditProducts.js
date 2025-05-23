import React, { memo, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@rneui/themed";
import { fontWeightBold } from "../../utils/utility";
import { deviceWidth } from "../../styles/styles";
import { formatNumber, removeFormatNumber } from "../../utils/helper";
import useTheme from "../../hooks/useTheme";
import GroupCheckBox from "../GroupCheckBox";
import FieldInput from "../fields/FieldInput";
import CachedImage from "../images/CachedImage";
import _ from 'lodash';

const ItemAuditProducts = memo(({ item, index, isUploaded = false, isShowImage = true, appColors, input, handlerAreaValue, handlerDisplayValue, handlerInputValue }) => {
    const { styleDefault } = useTheme();
    const isEditQuantity = input.type == 'QUANTITY' && input.item.ProductId == item.ProductId;
    const _jsonArea = JSON.parse(item.JsonArea || '[]');
    const _jsonPOSM = JSON.parse(item.JsonPOSM || '[]');
    const totalQuanityArea = _.sumBy(_jsonArea, 'QuantityValue');
    const posmValue = _.map(_.filter(_jsonPOSM, { isChoose: true }), 'ItemName').join(', ');
    const quantityValue = item.QuantityValue || null;
    const priceValue = item.PriceValue || null;
    //
    const onCheckBoxPress = useCallback((value) => {
        handlerDisplayValue(value, item, index);
    }, [handlerDisplayValue, item, index]);

    const onAreaInput = useCallback(() => {
        handlerAreaValue('AREA', item, index);
    }, [handlerAreaValue, item, index]);

    const onPOSMInput = useCallback(() => {
        handlerAreaValue('POSM', item, index);
    }, [handlerAreaValue, item, index]);

    const onInputQuantity = useCallback((text) => {
        item.QuantityValue = removeFormatNumber(text);
        handlerInputValue(item);
    }, [item, index, handlerInputValue]);

    const onInputPrice = useCallback((text) => {
        item.PriceValue = removeFormatNumber(text);
        handlerInputValue(item);
    }, [item, index, handlerInputValue]);

    // Styles
    const styles = StyleSheet.create({
        itemMain: { width: '100%', padding: 8 },
        itemContent: { backgroundColor: appColors.backgroundColor, borderRadius: 8, padding: 8, shadowColor: appColors.shadowColor, shadowOpacity: 0.5, shadowOffset: { width: 1, height: 3 }, elevation: 3, borderWidth: 1, borderColor: appColors.borderColor },
        titleHead: { width: '100%', minHeight: 38, fontSize: 14, fontWeight: fontWeightBold, color: appColors.textColor },
        imageStyle: { width: deviceWidth / 2.5, height: 120, alignItems: "center", marginBottom: 8 },
        viewFieldAction: { width: '100%', flexDirection: 'row', paddingTop: 5 },
        inputView: { width: '48%', backgroundColor: appColors.cardColor, alignItems: 'center', alignSelf: 'center', borderRadius: 5, paddingVertical: 5, borderWidth: 1, borderColor: appColors.borderColor },
        labelInput: { fontSize: 12, fontWeight: '500', color: appColors.placeholderColor, fontStyle: 'italic' },
        valueInput: { fontSize: 13, fontWeight: fontWeightBold, color: appColors.textColor, fontStyle: 'italic' },
        inputContainer: { width: '50%', height: 38, marginStart: -8, marginBottom: -8, backgroundColor: appColors.cardColor, borderRadius: 5 },
        inputStyle: { textAlign: 'center', fontSize: 12 }
    });
    return (
        <View key={`item-audit-product-${index}`} style={styles.itemMain} >
            <View style={styleDefault.contentItemMain}>
                <Text style={styles.titleHead}>{`${index + 1}. ${item.ProductName}`}</Text>
                <CachedImage
                    enable={isShowImage}
                    uri={item.PhotoPath}
                    style={styles.imageStyle}
                />
                <GroupCheckBox
                    enabled={item.isDisplay == 1}
                    isUploaded={isUploaded}
                    itemMain={item}
                    onPress={onCheckBoxPress}
                />
                {((item.isInputValue == 1 && (item.DisplayValue || null) !== null) || item.checkDisplayValue == 0) &&
                    <View style={styles.viewFieldAction}>
                        {item.isArea == 1 &&
                            <TouchableOpacity style={styles.inputView} onPress={onAreaInput} disabled={isUploaded}>
                                <Text allowFontScaling={false} style={styles.labelInput}>Tổng</Text>
                                <Text allowFontScaling={false} style={{ ...styles.valueInput, color: isEditQuantity ? appColors.errorColor : appColors.textColor }}>{formatNumber(totalQuanityArea, ',')}</Text>
                            </TouchableOpacity>
                        }
                        {item.isArea == 0 && item.isQuantity == 1 &&
                            <FieldInput
                                allowFontScaling={false}
                                placeholder="Số lượng"
                                keyboardType='numeric'
                                disabled={isUploaded}
                                value={formatNumber(quantityValue, ',')}
                                onChangeText={onInputQuantity}
                                style={styles.fieldView}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputStyle}
                            />
                        }
                        {item.isPrice == 1 &&
                            <FieldInput
                                allowFontScaling={false}
                                disabled={isUploaded}
                                placeholder='Giá'
                                defaultValue={item.PriceValue == 0 ? '0' : formatNumber(priceValue, ',')}
                                keyboardType="numeric"
                                inputContainerStyle={{ ...styles.inputContainer, width: '60%' }}
                                inputStyle={styles.inputStyle}
                                onChangeText={onInputPrice}
                            />
                        }
                    </View>
                }
                {item.isPOSM == 1 && (item.DisplayValue || null) !== null &&
                    <View style={styles.viewFieldAction}>
                        <TouchableOpacity style={{ ...styles.inputView, width: '100%' }} onPress={onPOSMInput} disabled={isUploaded}>
                            <Text style={styles.labelInput}>{`Vị trí`}</Text>
                            <Text style={{ ...styles.valueInput, color: isEditQuantity ? appColors.errorColor : appColors.textColor }}>{posmValue}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );
});

export default ItemAuditProducts;
