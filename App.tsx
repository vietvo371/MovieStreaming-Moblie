/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import toastConfig  from './src/const/ToastCustom';
import Tabs from './src/navigator/Tab';
import Screens from './src/navigator/AppNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

function TabNavigator() {
    return (
        <Tabs />
    );
}

const App = () => {
    GoogleSignin.configure({
        webClientId: '944810457078-bcpb0ss9ampvm92eoj59k34p9hrdgg15.apps.googleusercontent.com', // Lấy từ Google Cloud Console
        offlineAccess: true,
        forceCodeForRefreshToken: true, // Buộc yêu cầu refresh token mới
    });
    return (
        <>
            <Screens TabNavigator={TabNavigator} />
            <Toast config={toastConfig} />
        </>
    );
};

export default App;
