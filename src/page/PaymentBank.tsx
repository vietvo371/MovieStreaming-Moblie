import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import{ api } from  '../utils/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SCREEN_NAME from '../share/menu';
import Toast from 'react-native-toast-message';
interface HoaDon {
    id: number;
    id_goi: number;
    id_khach_hang: number;
    ma_hoa_don: string;
    ngay_bat_dau: string;
    ngay_ket_thuc: string;
    tinh_trang: number;
    tong_tien: number;
};

type RootStackParamList = {
    PaymentBank: { id_goi: string };
    PaymentSuccess: any
};
type PaymentBankProps = NativeStackScreenProps<RootStackParamList, 'PaymentBank'>;

const setTrueThanhToan = (id_hoa_don: number) => {
    api.post('/transation/set-status', {
        id: id_hoa_don,
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    }); 
}
const PaymentScreen = ({ route, navigation }: PaymentBankProps) => {
    const { id_goi } = route.params || {};
    const [isLoading, setIsLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hoaDon, setHoaDon] = useState<HoaDon | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const getQRCodeUrl = () => {
        api.post('/khach-hang/check-out/qr-payment', {
            id_goi: id_goi,
        })
            .then((res) => {
                if (res.data.status === true) {
                    setHoaDon(res.data.hoaDon);
                    setQrCode(res.data.link);
                    setUser(res.data.user);
                } else {
                    Toast.show({
                        type: 'error',
                        text2: res.data.message,
                    });
                }
            })
            .catch((err: any) => {
                console.log(err.data);
            })
    }

    useEffect(() => {
        getQRCodeUrl();
    }, [id_goi]);


    // Format the current date
    const currentDate = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }


    const handlePaymentComplete = () => {
        setIsLoading(true);
        setTrueThanhToan(hoaDon?.id || 0);
        // Simulate checking payment status
        setTimeout(() => {
            setIsLoading(false);
            Toast.show({
                type: 'success',
                text2: 'Thanh toán thành công!',
            });
            navigation.navigate("PaymentSuccess")   
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
                <View style={styles.placeholderView} />
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Payment Info Card */}
                <View style={styles.card}>
                    {/* Title */}
                    <Text style={styles.title}>QUÉT MÃ ĐỂ THANH TOÁN</Text>
                    <Text style={styles.subtitle}>Mã giao dịch: {hoaDon?.ma_hoa_don}</Text>
                    <Text style={styles.date}>Ngày tạo: {currentDate}</Text>

                    {/* QR Code Container */}
                    <View style={styles.qrContainer}>
                        {!imageLoaded && (
                            <ActivityIndicator size="large" color="#0088ff" style={styles.loader} />
                        )}
                        <Image
                            source={{ uri: qrCode || '' }}
                            style={styles.qrImage}
                            resizeMode="contain"
                            onLoadStart={() => setImageLoaded(false)}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </View>

                    {/* Bank Account Info */}
                    <View style={styles.bankInfoContainer}>
                        <Text style={styles.bankInfoTitle}>THÔNG TIN CHUYỂN KHOẢN</Text>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankInfoLabel}>Ngân hàng:</Text>
                            <Text style={styles.bankInfoValue}>MB Bank</Text>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankInfoLabel}>Chủ tài khoản:</Text>
                            <Text style={styles.bankInfoValue}>VO VAN VIET</Text>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankInfoLabel}>Số tài khoản:</Text>
                            <Text style={styles.bankInfoValue}>0708585120</Text>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankInfoLabel}>Số tiền:</Text>
                            <Text style={styles.bankInfoValue}> {formatPrice(hoaDon?.tong_tien || 0)}</Text>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankInfoLabel}>Nội dung CK:</Text>
                            <Text style={styles.bankInfoValue}>{hoaDon?.ma_hoa_don}</Text>
                        </View>
                    </View>

                    {/* Notice */}
                    <Text style={styles.notice}>
                        Vui lòng không chỉnh sửa nội dung chuyển khoản, nếu sai chúng tôi sẽ không thể xác nhận thanh toán của bạn!
                    </Text>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handlePaymentComplete}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.confirmText}>Tôi đã thanh toán xong</Text>
                    )}
                </TouchableOpacity>

                {/* Footer */}
                <Text style={styles.footer}>
                    Hóa đơn được tạo tự động và có giá trị mà không cần chữ ký và con dấu.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#0088ff',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholderView: {
        width: 40,
    },
    logoPlaceholder: {
        width: 80,
        height: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    logoText: {
        fontWeight: 'bold',
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0088ff',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0088ff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    date: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
        fontSize: 14,
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
        height: 250,
    },
    loader: {
        position: 'absolute',
    },
    qrImage: {
        width: '100%',
        height: '100%',
    },
    bankInfoContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    bankInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    bankInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    bankInfoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    bankInfoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    notice: {
        fontStyle: 'italic',
        color: '#e74c3c',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 18,
    },
    confirmButton: {
        backgroundColor: '#0088ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#0088ff',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
        marginBottom: 20,
        fontStyle: 'italic',
    },
});

export default PaymentScreen;
