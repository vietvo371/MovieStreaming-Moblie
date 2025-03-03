/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Toast from 'react-native-toast-message';
// import { toastConfig } from './src/const/ToastCustom';
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
