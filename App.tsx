import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon từ react-native-vector-icons

import Home from './compoments/page/Home';
import Profile from './compoments/page/Profile';
import Login from './compoments/wrapper/Login';
import Search from './compoments/page/SearchPage';
import Blog from './compoments/page/Blog';
import DetailFilm from './compoments/page/DetailFilm';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName = '';
        if (route.name === 'Trang chủ') {
        iconName = 'home-outline';
        } else if (route.name === 'Hồ sơ') {
        iconName = 'person-outline';
        } else if (route.name === 'Tìm kiếm') {
        iconName = 'search-outline';
        } else if (route.name === 'Blog') {
        iconName = 'book-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FFD700', // Màu vàng khi chọn
      tabBarInactiveTintColor: '#ffffff',
      tabBarStyle: {
        backgroundColor: '#000000',
        borderTopWidth: 0,
        paddingBottom: 5,
      },
      headerShown: false,
      })}>
      <Tab.Screen name="Trang chủ" component={Home} />
      <Tab.Screen name="Blog" component={Blog} />
      <Tab.Screen name="Tìm kiếm" component={Search} />
      <Tab.Screen name="Hồ sơ" component={Profile} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#000000"
          translucent
        />
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {backgroundColor: '#000000'},
            headerTintColor: '#ffffff',
            headerTitleStyle: {fontWeight: 'bold'},
            headerShown: false,
          }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="DetailFilm" component={DetailFilm} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
