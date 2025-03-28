import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import SCREEN_NAME from '../share/menu';

const PaymentSuccess = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={100} color="#4BB543" />
        </View>
        
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.message}>
          Cảm ơn bạn đã nâng cấp tài khoản VIP. 
          Hãy tận hưởng trải nghiệm giải trí không giới hạn!
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="access-time" size={24} color="#FF4500" />
            <Text style={styles.infoText}>Gói VIP đã được kích hoạt</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="movie" size={24} color="#FF4500" />
            <Text style={styles.infoText}>Xem phim chất lượng 4K</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="devices" size={24} color="#FF4500" />
            <Text style={styles.infoText}>Xem trên nhiều thiết bị</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.buttonText}>Bắt đầu xem ngay</Text>
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
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentSuccess; 