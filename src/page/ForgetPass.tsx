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
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Login: undefined;
  ResetPassword: { email: string, token: string };
};

const ForgotPassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 700;
  

  // Form state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  
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

  // Animate success state
  React.useEffect(() => {
    if (success) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [success]);
  
  // Validate email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) {
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/quen-mat-khau', {
        email: email,
      });

      if (response.data.status === true) {
        setSuccess(true);
        Toast.show({
          type: 'success',
          text2: 'Kiểm tra email để đặt lại mật khẩu!',
          position: 'top',
        });



        // Nếu API của bạn trả về token cho bước tiếp theo
        // navigation.navigate('ResetPassword', { email, token: response.data.token });
      } else {
        setError(response.data.message || 'Không thể gửi email khôi phục');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Email này chưa được đăng ký trong hệ thống');
      } else if (err.response?.status === 419) {
        setError('Lỗi xác thực CSRF. Vui lòng thử lại sau.');
      } else {
        setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
      }
      console.log('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
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

              <Text style={styles.title}>Quên mật khẩu?</Text>
              <Text style={styles.subtitle}>
                Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu
              </Text>
            </Animated.View>

            {/* Success state */}
            {success ? (
              <Animated.View 
                style={[
                  styles.successContainer,
                  {
                    opacity: successAnim,
                    transform: [{ scale: Animated.add(0.8, Animated.multiply(successAnim, 0.2)) }]
                  }
                ]}
              >
                <View style={styles.successIconContainer}>
                  <Icon name="email-check-outline" size={60} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Email đã được gửi!</Text>
                <Text style={styles.successText}>
                  Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                </Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleBackToLogin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>Quay lại đăng nhập</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              /* Form */
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
                  <Icon name="email-outline" size={20} color="#999999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999999"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="send"
                    onSubmitEditing={handleResetPassword}
                    autoFocus
                  />
                  {email.length > 0 && (
                    <TouchableOpacity 
                      style={styles.clearIcon} 
                      onPress={() => setEmail('')}
                    >
                      <Icon name="close-circle" size={18} color="#999999" />
                    </TouchableOpacity>
                  )}
                </View>

                {error ? (
                  <View style={styles.errorContainer}>
                    <Icon name="alert-circle-outline" size={18} color="#E31837" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.resetButtonText}>Gửi hướng dẫn</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.orText}>hoặc</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={handleBackToLogin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 20,
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
  clearIcon: {
    padding: 16,
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
  resetButton: {
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
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  orText: {
    color: '#999999',
    fontSize: 14,
    marginHorizontal: 12,
  },
  backToLoginButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#242424',
  },
  backToLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E31837',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#E31837',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#E31837',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#E31837',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
