import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme'
import GradientBackground from '../../components/GradientBackground'
import Header from '../../components/Header'
import CustomListView from '../../components/lists/CustomListView'
import { MENU_API } from '../../services/menuApi'
import Loading from '../../components/Loading'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/themed'
import appConfig from '../../utils/appConfig/appConfig'
import { handlerGoBack } from '../../utils/helper'

const DocumentScreen = ({ navigation }) => {
    const { appColors, styleDefault } = useTheme()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const LoadData = async () => {
        await setLoading(true)
        await MENU_API.GetListDocument(setData)
        await setLoading(false)
    }
    const onSelected = (itemDoc) => {
        navigation.navigate('DocumentDetail', { itemDoc })
    }
    useEffect(() => {
        LoadData()
    }, [])
    //
    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        itemGroup: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        listDoc: { flex: 1, justifyContent: 'center' },
        name: { padding: 3, fontSize: 12, marginTop: 5, color: appColors.darkColor, textAlign: 'center' }
    })
    const renderItem = ({ item, index }) => {
        const onPress = () => onSelected(item)
        return (
            <TouchableOpacity onPress={onPress} style={styles.itemGroup} key={index}>
                <Icon color={appColors.primary} size={36} name='folder-open' solid type={appConfig.ICON_TYPE} />
                <Text style={styles.name}>{`${item.groupName}`}</Text>
            </TouchableOpacity>
        )
    }
    if (loading) return <Loading isLoading={loading} />
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title={'Quản lý tài liệu'}
                onLeftPress={() => handlerGoBack(navigation)}
            />
            <View style={styleDefault.contentMain}>
                <CustomListView
                    numColumns={3}
                    renderItem={renderItem}
                    data={data}
                    extraData={data}
                />
            </View>
        </SafeAreaView>
    )
}
export default DocumentScreen