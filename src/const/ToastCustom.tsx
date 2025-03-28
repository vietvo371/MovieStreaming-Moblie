import { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#2ECC71',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                width: wp('90%'),
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2ECC71',
            }}
            text2Style={{
                fontSize: 14,
                color: '#34495E',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <Image 
                        source={require('../assets/icons/success.png')} 
                        style={styles.icon}
                    />
                </View>
            )}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#E74C3C',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                width: wp('90%'),
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#E74C3C',
            }}
            text2Style={{
                fontSize: 14,
                color: '#34495E',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <Image 
                        source={require('../assets/icons/error.png')} 
                        style={styles.icon}
                    />
                </View>
            )}
        />
    ),
    warning: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#F1C40F',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                width: wp('90%'),
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#F1C40F',
            }}
            text2Style={{
                fontSize: 14,
                color: '#34495E',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <Image 
                        source={require('../assets/icons/warning.png')} 
                        style={styles.icon}
                    />
                </View>
            )}
        />
    ),  
};

const styles = StyleSheet.create({
    iconContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});

export default toastConfig;