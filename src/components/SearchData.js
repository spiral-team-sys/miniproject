import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import FieldInput from "./fields/FieldInput";
import useTheme from "../hooks/useTheme";
import { inputHeight } from "../styles/styles";

const SearchData = ({ placeholder, visible = true, value = null, iconName = 'search', onSearchData }) => {
    const { appColors } = useTheme()
    const [search, setItemSearch] = useState({ text: '', isSearch: false })
    const [_mutate, setMutate] = useState(false)
    //
    const hanlerChangeValue = (text) => {
        search.text = text
        setMutate(e => !e)
        onSearchData(text)
    }
    const onFocusSearch = () => {
        search.isSearch = !search.isSearch
        setMutate(e => !e)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        setItemSearch({ ...search, text: value })
        return () => { isMounted = false }
    }, [value])
    // View
    const styles = StyleSheet.create({
        searchContainer: { height: inputHeight, backgroundColor: appColors.backgroundColor, borderColor: appColors.primaryColor, marginTop: 8, borderRadius: 50 },
        searchContainerInput: { height: inputHeight, backgroundColor: appColors.primaryColor, borderColor: appColors.backgroundColor, marginTop: 8, borderRadius: 50 },
        searchInputStyle: { color: appColors.backgroundColor },
        searchStyle: { color: appColors.primaryColor },
    })
    if (!visible) return <View />
    return (
        <FieldInput
            value={search.text}
            placeholder={placeholder}
            leftIconName={iconName}
            leftIconColor={search.isSearch ? appColors.backgroundColor : appColors.primaryColor}
            useClearAndroid={search.text !== null && search.text.length > 0}
            placeholderColor={search.isSearch ? appColors.backgroundColor : appColors.primaryColor}
            inputContainerStyle={search.isSearch ? styles.searchContainerInput : styles.searchContainer}
            inputStyle={search.isSearch ? styles.searchInputStyle : styles.searchStyle}
            onChangeText={hanlerChangeValue}
            onFocus={onFocusSearch}
            onEndEditing={onFocusSearch}
        />
    )
}
export default SearchData;