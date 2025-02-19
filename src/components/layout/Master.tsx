import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ColorGeneral } from "../../const/ColorGeneral";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';

const Master = ({ children, navigation, title }: { children: React.ReactNode, navigation: any, title: string }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {/* <Image source={require('../../assets/image/logoW.png')} style={styles.logo} /> */}
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
                <View style={styles.containerContent}>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
    },
    content: {
        flex: 1,
        paddingHorizontal: wp('2%'),
        paddingBottom: hp('2%'),
        backgroundColor: '#f2f4f4',
    },
    header: {
        flexDirection: 'row',
        height: hp('6%'),
    },
    headerLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
    },
    headerRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp('4%'),
        backgroundColor: ColorGeneral.primary,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: '#fff',
    },
    logo: {
        width: hp('12%'),
        height: hp('12%'),
        resizeMode: 'contain',
    },
    containerContent: {
        flex: 1,
        marginTop: hp('1%'),
        paddingHorizontal: wp('2%'),
    },
});

export default Master;
