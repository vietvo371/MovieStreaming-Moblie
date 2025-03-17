import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SCREEN_NAME from '../share/menu';
import { View } from 'react-native';
const GoogleLogin = ({ navigation , route}: { navigation: NativeStackNavigationProp<any>, route: any }) => {
  const { url } = route.params;
  console.log(url);
  return (
    <View style={{ flex: 1 }}>
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={(navState: any) => {
        // Xử lý khi URL thay đổi, ví dụ để bắt callback
        if (navState.url.includes('/auth/google/callback')) {
          // Xử lý khi thanh toán thành công
          console.log(navState.url);
        }
      }}
    />
    </View>
  );
};

export default GoogleLogin;  