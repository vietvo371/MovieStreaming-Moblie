import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import SCREEN_NAME from '../share/menu';
import { api } from '../utils/api';
import Toast from 'react-native-toast-message';

const PaymentMethod = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const route = useRoute();
  const { packageInfo } = route.params as { packageInfo: any };
  const [payUrl, setPayUrl] = useState<string>('');
  const [isLoadingMomo, setIsLoadingMomo] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isGoiVip, setIsGoiVip] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const checkGoiVip = () => {
    api.post('/khach-hang/check-out/process', {
      id_goi: packageInfo.id,
    }).then((res) => {
      console.log(res.data);
      if (res.data.status === true) {
        setIsGoiVip(res.data.check);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  const handleHome = () => {
    Toast.show({
      text1: 'Bạn đã mua gói Vip không thể mua lại',
      type: 'warning',
    });
  }
  const handlePaymentMomo = () => {
    setIsLoadingMomo(true);
    api.post('khach-hang/thanh-toan/momo/create', {
      id_goi: packageInfo.id,
    })
      .then((res) => {
        setIsLoadingMomo(false);
        if (res.data.status === true) {
          setPayUrl(res.data?.payUrl);
          navigation.navigate(SCREEN_NAME.PAYMENT_WEBVIEW, {
            url: res.data.payUrl,
            orderId: packageInfo.id
          });
        }
        else {
          console.log(res.data.message);

          navigation.navigate(SCREEN_NAME.PAYMENT_ERROR);
        }
      })
      .catch((err: any) => {
        setIsLoadingMomo(false);
        console.log(err.data);
      });
  };
  const handlePaymentVnpay = () => {
    setIsLoadingMomo(true);
    api.post('khach-hang/thanh-toan/vnpay/create', {
      id_goi: packageInfo.id,
    })
      .then((res) => {
        setIsLoadingMomo(false);
        if (res.data.status === true) {
          setPayUrl(res.data?.payUrl);
          navigation.navigate(SCREEN_NAME.PAYMENT_WEBVIEW, {
            url: res.data.payUrl,
            orderId: packageInfo.id
          });
        }
        else {
          console.log(res.data.message);
          navigation.navigate(SCREEN_NAME.PAYMENT_ERROR);
        }
      })
      .catch((err: any) => {
        setIsLoadingMomo(false);
        console.log(err.data);
      });
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      // Hiển thị thông báo yêu cầu chọn phương thức thanh toán
      console.log('Vui lòng chọn phương thức thanh toán');
      return;
    }

    switch (selectedMethod) {
      case 'bank':
        navigation.navigate(SCREEN_NAME.PAYMENT_BANK, { id_goi: packageInfo.id });
        break;
      case 'momo':
        handlePaymentMomo();
        break;
      case 'vnpay':
        handlePaymentVnpay();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    checkGoiVip();
  }, [packageInfo]);

  return (
    <SafeAreaView style={styles.container}>
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
      <ScrollView>

        <View style={styles.packageInfoCard}>
          <Text style={styles.packageLabel}>Gói đã chọn</Text>
          <Text style={styles.packageName}>{packageInfo.ten_goi}</Text>
          <Text style={styles.packagePrice}>{formatPrice(packageInfo.tien_sale)}</Text>
        </View>

        <View style={styles.paymentOptions}>
          <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>

          <TouchableOpacity
            style={[styles.paymentOption, selectedMethod === 'bank' && styles.selectedOption]}
            onPress={() => setSelectedMethod('bank')}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/image/mbbank-logo-5.png')}
                  style={styles.paymentIcon}
                />
              </View>
              <View style={styles.paymentTextContainer}>
                <Text style={styles.paymentTitle}>Chuyển khoản ngân hàng</Text>
                <Text style={styles.paymentDesc}>Thanh toán qua MB Bank</Text>
              </View>
            </View>
            <View style={styles.radioButton}>
              {selectedMethod === 'bank' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedMethod === 'momo' && styles.selectedOption]}
            onPress={() => setSelectedMethod('momo')}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/image/momo-icon.png')}
                  style={styles.paymentIcon}
                />
              </View>
              <View style={styles.paymentTextContainer}>
                <Text style={styles.paymentTitle}>Ví MoMo</Text>
                <Text style={styles.paymentDesc}>Thanh toán qua ví điện tử MoMo</Text>
              </View>
            </View>
            <View style={styles.radioButton}>
              {selectedMethod === 'momo' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedMethod === 'vnpay' && styles.selectedOption]}
            onPress={() => setSelectedMethod('vnpay')}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/image/vnpay-icon.webp')}
                  style={styles.paymentIcon}
                />
              </View>
              <View style={styles.paymentTextContainer}>
                <Text style={styles.paymentTitle}>VNPAY</Text>
                <Text style={styles.paymentDesc}>Thanh toán qua cổng VNPAY</Text>
              </View>
            </View>
            <View style={styles.radioButton}>
              {selectedMethod === 'vnpay' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.payButtonContainer}>
          <TouchableOpacity
            style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
            onPress={isGoiVip ? handleHome : handlePayment}
            disabled={!selectedMethod || isLoadingMomo}
          >
            <Text style={styles.payButtonText}>
              {isLoadingMomo ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#262626',
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
  packageInfoCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#262626',
    borderRadius: 16,
    elevation: 4,
  },
  packageLabel: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 24,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  paymentOptions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#262626',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(182, 109, 40, 0.15)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  paymentIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  paymentTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4500',
  },
  payButtonContainer: {
    padding: 16,
    marginTop: 'auto',
    backgroundColor: '#262626',
  },
  payButton: {
    backgroundColor: '#FF4500',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#FF4500',
    shadowOpacity: 0,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentMethod;
