import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import useTheme from "../../../hooks/useTheme";
import FieldInput from "../../fields/FieldInput";

const FieldNoteKPI = ({ placeholder, value = null, onChangeData }) => {
    const { appColors } = useTheme()
    const [note, setItemNote] = useState({ text: '', isNote: false })
    const [_mutate, setMutate] = useState(false)
    //
    const hanlerChangeValue = (text) => {
        note.text = text
        setMutate(e => !e)
        onChangeData && onChangeData(text)
    }
    const onFocusNote = () => {
        note.isNote = !note.isNote
        setMutate(e => !e)
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        setItemNote({ ...note, text: value })
        return () => { isMounted = false }
    }, [value])
    // View
    const styles = StyleSheet.create({
        noteContainer: { height: 38, backgroundColor: appColors.backgroundColor, borderColor: appColors.primaryColor, borderRadius: 50 },
        noteContainerInput: { height: 38, backgroundColor: appColors.primaryColor, borderColor: appColors.backgroundColor, borderRadius: 50 },
        noteInputStyle: { color: appColors.backgroundColor, fontSize: 12 },
        noteStyle: { color: appColors.primaryColor, fontSize: 12 },
    })
    return (
        <FieldInput
            value={note.text}
            placeholder={placeholder || 'Ghi chú'}
            leftIconName={note.isNote ? 'chatbubble' : 'chatbubble-outline'}
            leftIconColor={note.isNote ? appColors.backgroundColor : appColors.primaryColor}
            useClearAndroid={note.text !== null && note.text.length > 0}
            placeholderColor={note.isNote ? appColors.backgroundColor : appColors.primaryColor}
            inputContainerStyle={note.isNote ? styles.noteContainerInput : styles.noteContainer}
            inputStyle={note.isNote ? styles.noteInputStyle : styles.noteStyle}
            onChangeText={hanlerChangeValue}
            onFocus={onFocusNote}
            onEndEditing={onFocusNote}
        />
    )
}
export default FieldNoteKPI;