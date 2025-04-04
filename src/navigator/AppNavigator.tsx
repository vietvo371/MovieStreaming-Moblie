import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '../pages/Onboarding/OnboardingScreen';
import LoginPage from '../page/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorGeneral } from '../const/ColorGeneral';
import SCREEN_NAME from '../share/menu/index';
import DetailFilm from '../page/DetailFilm';
import Blog from '../page/Blog';
import BlogDetail from '../page/Blogdetail';
import Wishlist from '../page/WatchlistPage';
import RegisterPage from '../page/Register';
import WatchPage from '../page/Watchpage';
import GoiVip from '../page/GoiVip';
import Loading from '../page/Loading';
import Home from '../page/Home';
import TypeFilm from '../page/TypeFilm';
import GenreFilm from '../page/GenrePage';
import AllFilm from '../page/AllFilm';
import PageProfile from '../page/PageProfile';
import PageSetting from '../page/PageSetting';
import BillingInfo from '../page/BillingInfo';
import WatchHistory from '../page/WatchHistory';
import PaymentMethod from '../page/PaymentMethod';
import PaymentSuccess from '../page/PaymentSuccess';
import PaymentError from '../page/PaymentError';
import PaymentBank from '../page/PaymentBank';
import PaymentWebView from '../screens/PaymentWebView';
import StatusPayment from '../page/StatusPayment';
import GoogleLogin from '../screens/GoogleLogin';
import ForgetPass from '../page/ForgetPass';
const Stack = createStackNavigator();

type ScreensProps = {
  TabNavigator: React.ComponentType<any>;
};

const AppNavigator = ({ TabNavigator }: ScreensProps) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null; // Hoặc hiển thị màn hình splash
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name={SCREEN_NAME.LOGIN}
          component={LoginPage}
        />
        <Stack.Screen
          name={SCREEN_NAME.TYPE_FILM}
          component={TypeFilm}
          options={{
            headerShown: false,
            title: 'Loại phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.PAYMENT_WEBVIEW}
          component={PaymentWebView}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name={SCREEN_NAME.PAYMENT_BANK}
          component={PaymentBank}
          options={{
            headerShown: false,
            title: 'Thanh toán',
            headerTintColor: ColorGeneral.primary,
          }}
        />

        <Stack.Screen
          name={SCREEN_NAME.BILLING_INFO}
          component={BillingInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.WATCH_HISTORY}
          component={WatchHistory}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.ALL_FILM}
          component={AllFilm}
          options={{
            headerShown: false,
            title: 'Tất cả phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.PAGE_PROFILE}
          component={PageProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.PAGE_SETTING}
          component={PageSetting}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.GENRE_FILM}
          component={GenreFilm}
          options={{
            headerShown: false,
            title: 'Thể loại phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.DETAIL_FILM}
          component={DetailFilm}
          options={{
            headerShown: false,
            title: 'Chi tiết phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.BLOG}
          component={Blog}
          options={{
            headerShown: false,
            title: 'Blog',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.BLOG_DETAIL}
          component={BlogDetail}
          options={{
            headerShown: false,
            title: 'Chi tiết bài viết',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.WISHLIST}
          component={Wishlist}
          options={{
            headerShown: false,
            title: 'Yêu thích',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.REGISTER}
          component={RegisterPage}
          options={{
            headerShown: false,
            title: 'Đăng ký',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.WATCH_PAGE}
          component={WatchPage}
          options={{
            headerShown: false,
            title: 'Xem phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.GOIVIP}
          component={GoiVip}
          options={{
            headerShown: false,
            title: 'Goi Vip',
            headerTintColor: ColorGeneral.primary,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAME.PAYMENT_METHOD}
          component={PaymentMethod}
          options={{
            headerShown: false,
          }}
        />
            <Stack.Screen
              name={SCREEN_NAME.PAYMENT_SUCCESS}
              component={PaymentSuccess}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={SCREEN_NAME.PAYMENT_ERROR}
                component={PaymentError} 
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={SCREEN_NAME.STATUS_PAYMENT}
              component={StatusPayment}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={SCREEN_NAME.GOOGLE_LOGIN}
              component={GoogleLogin}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={SCREEN_NAME.FORGET_PASS}
              component={ForgetPass}
              options={{
                headerShown: false, 
              }}
            />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
