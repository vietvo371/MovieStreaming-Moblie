import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import SCREEN_NAME from '../share/menu';
const PaymentMethod = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const route = useRoute();
  const { packageInfo } = route.params as { packageInfo: any };

  const handlePaymentSelection = (method: string) => {
    console.log('Phương thức thanh toán được chọn:', method);
    // Xử lý thanh toán tại đây
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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

      <View style={styles.packageInfo}>
        <Text style={styles.packageName}>{packageInfo.ten_goi}</Text>
        <Text style={styles.packagePrice}>{formatPrice(packageInfo.tien_sale)}</Text>
      </View>

      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate(SCREEN_NAME.PAYMENT_SUCCESS)}
        >
          <Image
            source={require('../assets/image/mbbank-logo-5.png')}
            style={styles.paymentIcon}
          />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentTitle}>Chuyển khoản ngân hàng</Text>
            <Text style={styles.paymentDesc}>Thanh toán qua tài khoản ngân hàng</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate(SCREEN_NAME.PAYMENT_ERROR)}
        >
          <Image
            source={require('../assets/image/momo-icon.png')}
            style={styles.paymentIcon}
          />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentTitle}>Ví MoMo</Text>
            <Text style={styles.paymentDesc}>Thanh toán qua ví điện tử MoMo</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate(SCREEN_NAME.PAYMENT_ERROR)}
        >
          <Image
            source={require('../assets/image/vnpay-icon.webp')}
            style={styles.paymentIcon}
          />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentTitle}>VNPAY</Text>
            <Text style={styles.paymentDesc}>Thanh toán qua cổng VNPAY</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 100 }}>

      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
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
  packageInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  packageName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  paymentOptions: {
    padding: 16,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 16,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});

export default PaymentMethod; 