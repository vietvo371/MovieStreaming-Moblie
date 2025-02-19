/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    SafeAreaView,
    Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/page/Login';
import Toast from 'react-native-toast-message';
// import { toastConfig } from './src/const/ToastCustom';
import { ColorGeneral } from './src/const/ColorGeneral';
import Tabs from './src/navigator/Tab';
import Screens from './src/navigator/AppNavigator';

function TabNavigator() {
    return (
        <Tabs />
    );
}

const App = () => {
    return (
        <>
            <Screens TabNavigator={TabNavigator} />
            {/* <Toast config={toastConfig} /> */}
        </>
    );
};

export default App;
