import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, SafeAreaView, StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const StatusPayment = ({ navigation, route }: { navigation: any, route: any }) => {
  const params = route.params.params as any;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isPaymentSuccess = params?.type === 'momo' 
    ? params?.resultCode === "0"
    : params?.vnp_ResponseCode === "00";
  console.log(params);

  const paymentInfo = params?.type === 'momo' ? {
    amount: parseInt(params?.amount),
    orderInfo: params?.orderId,
    transactionNo: params?.transId,
    paymentType: 'momo',
    responseCode: params?.resultCode
  } : {
    amount: parseInt(params?.vnp_Amount) / 100,
    orderInfo: params?.vnp_TxnRef,
    transactionNo: params?.vnp_TransactionNo,
    paymentType: 'vnpay',
    responseCode: params?.vnp_ResponseCode,
    bankCode: params?.vnp_BankCode
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isPaymentSuccess ? '#28a745' : '#dc3545'}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={isPaymentSuccess ? ['#28a745', '#20c997'] : ['#dc3545', '#f86384']}
          style={styles.headerGradient}
        >
          <View style={styles.iconContainer}>
            <Icon 
              name={isPaymentSuccess ? "check-circle" : "times-circle"} 
              size={80} 
              color="#FFFFFF" 
            />
          </View>

          <Text style={styles.headerTitle}>
            {isPaymentSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.message}>
            {isPaymentSuccess 
              ? "Cảm ơn bạn đã thanh toán. Chúng tôi sẽ gửi hóa đơn qua email của bạn."
              : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại!"}
          </Text>

          {isPaymentSuccess && (
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <View style={styles.iconWrapper}>
                  <Icon name="money-bill-wave" size={20} color="#28a745" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Số tiền thanh toán</Text>
                  <Text style={styles.detailValue}>{formatCurrency(paymentInfo.amount)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconWrapper}>
                  <Icon name="receipt" size={20} color="#28a745" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Mã giao dịch</Text>
                  <Text style={styles.detailValue}>{paymentInfo.transactionNo}</Text>
                </View>
              </View>

              {paymentInfo.paymentType === 'vnpay' && (
                <View style={styles.detailRow}>
                  <View style={styles.iconWrapper}>
                    <Icon name="university" size={20} color="#28a745" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Ngân hàng</Text>
                    <Text style={styles.detailValue}>{paymentInfo.bankCode}</Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <View style={styles.iconWrapper}>
                  <Icon name="credit-card" size={20} color="#28a745" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phương thức thanh toán</Text>
                  <Text style={styles.detailValue}>
                    {paymentInfo.paymentType === 'momo' ? 'Ví MOMO' : 'VNPAY'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Hỗ trợ khách hàng</Text>
            
            <TouchableOpacity 
              style={styles.supportButton}
              onPress={() => Linking.openURL('mailto:vietdev2106@gmail.com')}
            >
              <View style={styles.supportIconWrapper}>
                <Icon name="envelope" size={20} color="#007bff" />
              </View>
              <Text style={styles.supportButtonText}>vietdev2106@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.supportButton}
              onPress={() => Linking.openURL('tel:0905123456')}
            >
              <View style={styles.supportIconWrapper}>
                <Icon name="phone" size={20} color="#007bff" />
              </View>
              <Text style={styles.supportButtonText}>0905.123.456</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Icon name="home" size={20} color="#FFFFFF" />
            <Text style={styles.homeButtonText}>Trở về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  details: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  supportSection: {
    marginVertical: 20,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#007bff',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default StatusPayment;