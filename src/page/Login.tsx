import React, { useState } from 'react';
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

type RootStackParamList = {
  Register: undefined;
  MainApp: undefined;
  ForgotPassword: undefined;
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
        navigation.replace('MainApp');
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

  const handleLoginWithGoogle = () => {
    navigation.navigate("GoogleLogin", {
      url: `${baseUrl}/auth/google`,
    });
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

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
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
            <View style={[
              styles.socialSection,
              { marginBottom: isSmallDevice ? 20 : 32 }
            ]}>
              <Text style={styles.orText}>hoặc tiếp tục với</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={require('../assets/image/facebook.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleLoginWithGoogle();
                }} style={styles.socialButton}>
                  <Image source={require('../assets/image/google-icon.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={require('../assets/image/apple.png')} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
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
    alignItems: 'center',
  },
  orText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    marginHorizontal: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
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