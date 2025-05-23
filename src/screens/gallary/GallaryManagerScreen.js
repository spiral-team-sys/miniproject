import React from 'react';
import { StyleSheet, View } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handlerGoBack } from '../../utils/helper';
import useTheme from '../../hooks/useTheme';
import Header from '../../components/Header';
import ShopGallaryList from '../../components/lists/ShopGallaryList';
import { deviceHeight } from '../../styles/styles';

const GallaryManagerScreen = ({ navigation, route }) => {
    const { styleDefault, appColors } = useTheme();
    //  
    const handlerShowDetails = (item) => {
        navigation.navigate('GallaryDetails', { itemShop: item })
    }

    const onBack = () => {
        handlerGoBack(navigation)
    }

    const styles = StyleSheet.create({
        mainContainer: { flex: 1 },
        contentSheet: { width: '100%', height: deviceHeight },
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <GradientBackground />
            <Header
                title='Thư viện'
                onLeftPress={onBack}
            />
            <View style={styleDefault.contentMain}>
                <ShopGallaryList navigation={navigation} onShowDetails={handlerShowDetails} />
            </View>
        </SafeAreaView>
    )
};
export default GallaryManagerScreen;
