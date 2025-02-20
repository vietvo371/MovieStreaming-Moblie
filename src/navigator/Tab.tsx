import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../page/Home';
import WatchlistPage from '../page/WatchlistPage';
import BlogPage from '../page/Blog';
import SearchPage from '../page/SearchPage';
import ProfilePage from '../page/Profile';
import GoiVip from '../page/GoiVip';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#FF4500',
                tabBarInactiveTintColor: '#666',
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchPage}
                options={{
                    tabBarLabel: 'Tìm kiếm',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="magnify" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Watchlist"
                component={WatchlistPage}
                options={{
                    tabBarLabel: 'Yêu thích',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart" color={color} size={26} />
                    ),
                }}
            />
             <Tab.Screen
                name="Blog"
                component={BlogPage}
                options={{
                    tabBarLabel: 'Blog',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="book-open-outline" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#161616',
        borderTopWidth: 0,
        elevation: 8,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default TabNavigator;
