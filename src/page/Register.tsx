import React, { useState, useRef } from 'react';
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
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { api } from '../utils/api';
import { saveToken } from '../utils/TokenManager';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Register = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) => {
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 700;

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Input refs for focus handling
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Animate components on mount
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

  // Validate form fields
  const validateForm = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/khach-hang/register', {
        ho_va_ten: name,
        email,
        password,
        re_password: confirmPassword,
      });
      console.log(response.data);

      if (response.data.status === true) {
        console.log('Đăng ký thành công');
      } else {
        setError(response.data.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data?.message || 'Thông tin không hợp lệ');
      } else {
        setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
      }
      console.log('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <LinearGradient
        colors={['#1f1f1f', '#121212']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContentContainer,
              { paddingTop: isSmallDevice ? height * 0.03 : height * 0.05 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View
              style={[
                styles.headerContainer,
                {
                  marginBottom: isSmallDevice ? height * 0.03 : height * 0.05,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Image
                source={require('../assets/image/logoW.png')}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.title}>Tạo tài khoản mới</Text>
              <Text style={styles.subtitle}>Đăng ký để trải nghiệm dịch vụ tốt nhất từ chúng tôi</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.inputWrapper}>
                <Icon name="account-outline" size={20} color="#999999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor="#999999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={20} color="#999999" style={styles.inputIcon} />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color="#999999" style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Icon name="lock-check-outline" size={20} color="#999999" style={styles.inputIcon} />
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>

              {/* <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Icon name="check" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
              </View> */}

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle-outline" size={18} color="#E31837" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Đăng ký</Text>
                    <Icon name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.socialSection}>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.orText}>Hoặc đăng ký với</Text>
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

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradientBackground: {
    flex: 1,
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
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 24, 55, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#E31837',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#E31837',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#E31837',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 23,
  },
  loginText: {
    color: '#999999',
    fontSize: 14,
  },
  loginLink: {
    color: '#E31837',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Register;
