import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  useWindowDimensions,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveUser } from '../utils/TokenManager';
import { api, baseUrl } from '../utils/api';
import { DisplayMessage } from '../../general/Notification';
import { saveToken } from '../utils/TokenManager';
import WebView from 'react-native-webview';
import SCREEN_NAME from '../share/menu';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';


type RootStackParamList = {
  Register: undefined;
  Main: undefined;
  ForgetPass: undefined;
  GoogleLogin: { url: string };
};

const Login = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) => {
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 700;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const handleLogin = async () => {
    console.log(email, password);
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/khach-hang/login', {
        email: email,
        password: password,
      });

      if (response.data.status) {
        await saveToken(response.data.token);
        // await saveUser(response.data.user);
        navigation.navigate('Main');
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data?.message || 'Thông tin không hợp lệ');
      } else {
        setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
      }
      console.log('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // const handleLoginWithGoogle = () => {
  //   navigation.navigate("GoogleLogin", {
  //     url: `${baseUrl}/auth/google`,
  //   });
  // };
  GoogleSignin.configure({
    webClientId: '944810457078-bcpb0ss9ampvm92eoj59k34p9hrdgg15.apps.googleusercontent.com', // Lấy từ Google Cloud Console
    offlineAccess: true,
    forceCodeForRefreshToken: true, // Buộc yêu cầu refresh token mới
  });
  const handleLoginWithGoogle = async () => {
    try {
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        console.log('User info:', userInfo);
        handleGoogleAuthentication(userInfo);
      } else {
        console.log('User info:', userInfo);
      }
      // Xử lý đăng nhập thành công
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  // Gửi idToken đến backend Laravel
  const handleGoogleAuthentication = async (userInfo: any) => {
    console.log(userInfo.data.idToken);
    try {
      const response = await api.post('/khach-hang/login-google', {
        id_token: userInfo.data.idToken
      });
      

      if (response.data.status === true) {
        await saveToken(response.data.token);
        navigation.replace('Main');
        // Lưu token vào AsyncStorage
        Toast.show({
          type: 'success',
          text2: 'Đăng nhập thành công!',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      Toast.show({
        type: 'error',
        text2: 'Lỗi kết nối',
      });
      
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingTop: isSmallDevice ? height * 0.05 : height * 0.08 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[
            styles.headerContainer,
            { marginBottom: isSmallDevice ? height * 0.04 : height * 0.06 }
          ]}>
            <Image
              source={require('../assets/image/logoW.png')}
              style={[
                styles.logo
              ]}
              resizeMode="cover"
            />
            <Text style={styles.title}>Chào mừng trở lại</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={[
              styles.inputContainer,
              { marginBottom: isSmallDevice ? 16 : 20 }
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={[
              styles.inputContainer,
              { marginBottom: isSmallDevice ? 8 : 12 }
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            <View style={[
              styles.forgotPasswordContainer,
              { marginBottom: isSmallDevice ? 16 : 24 }
            ]}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Icon name="check" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.signInButton,
                { marginBottom: isSmallDevice ? 20 : 32 }
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            {/* Social login section */}
            <View style={styles.socialSection}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>Hoặc đăng nhập với</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity 
                style={styles.googleButton}
                onPress={handleLoginWithGoogle}
              >
                <Image 
                  source={require('../assets/image/google-icon.png')} 
                  style={styles.googleIcon} 
                />
                <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>
            </View>

            {/* Register link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E31837',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#242424',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E31837',
    borderColor: '#E31837',
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#E31837',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#E31837',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  orText: {
    color: '#999999',
    marginHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242424',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#999999',
    fontSize: 14,
  },
  registerLink: {
    color: '#E31837',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E31837',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default Login;