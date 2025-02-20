import { NavigationContainer } from '@react-navigation/native';
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
const Stack = createNativeStackNavigator();

type ScreensProps = {
  TabNavigator: React.ComponentType<any>;
};

const AppNavigator = ({ TabNavigator }: ScreensProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={SCREEN_NAME.LOGIN}>
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen
          name={SCREEN_NAME.LOGIN}
          component={LoginPage}
          options={{
            headerShown: false,
            title: 'Đăng nhập',
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
            title: 'Xem phim',
            headerTintColor: ColorGeneral.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
