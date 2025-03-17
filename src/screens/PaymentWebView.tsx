import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SCREEN_NAME from '../share/menu';

const PaymentWebView = ({ navigation , route}: { navigation: NativeStackNavigationProp<any>, route: any }) => {
  const { url } = route.params;

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={(navState: any) => {
        // Xử lý khi URL thay đổi, ví dụ để bắt callback
        if (navState.url.includes('/payment-status')) {
          // Xử lý khi thanh toán thành công
          const params = Object.fromEntries(navState.url.split('?')[1].split('&').map((item: any) => item.split('=')));
          console.log(params);
          navigation.navigate(SCREEN_NAME.STATUS_PAYMENT, { params });
        }
      }}
    />
  );
};

export default PaymentWebView;  