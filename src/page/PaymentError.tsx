import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';

const PaymentError = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="error" size={100} color="#FF4500" />
        </View>
        
        <Text style={styles.title}>Thanh toán thất bại!</Text>
        <Text style={styles.message}>
          Rất tiếc, đã xảy ra lỗi trong quá trình thanh toán.
          Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </Text>

        <View style={styles.errorContainer}>
          <View style={styles.errorRow}>
            <Icon name="info" size={24} color="#FF4500" />
            <Text style={styles.errorText}>
              Kiểm tra kết nối internet của bạn
            </Text>
          </View>
          <View style={styles.errorRow}>
            <Icon name="account-balance-wallet" size={24} color="#FF4500" />
            <Text style={styles.errorText}>
              Đảm bảo số dư tài khoản đủ để thanh toán
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Thử lại</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.changeMethodButton]}
            onPress={() => navigation.navigate('PaymentMethod')}
          >
            <Text style={styles.buttonText}>Đổi phương thức thanh toán</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => {/* Xử lý hỗ trợ */}}
        >
          <Icon name="headset-mic" size={20} color="#FFFFFF" />
          <Text style={styles.supportText}>Liên hệ hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,69,0,0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#FF4500',
  },
  changeMethodButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  supportText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default PaymentError; 