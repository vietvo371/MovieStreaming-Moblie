import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../utils/api';
import Toast from 'react-native-toast-message';
// import { DisplayError } from '../../general/Notification';

interface User {
  id: number;
  ho_va_ten: string;
  so_dien_thoai: string;
  avatar: string;
  email: string;
}
const { width } = Dimensions.get('window');

export default function PageProfile({ navigation }: { navigation: any }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [old_pass, setold_pass] = useState('');
  const [new_pass, setnew_pass] = useState('');
  const [re_new_pass, setre_new_pass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [user, setUser] = useState<User>({
    id: 0,
    ho_va_ten: '',
    so_dien_thoai: '',
    avatar: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    ho_va_ten: '',
    so_dien_thoai: '',
    old_pass: '',
    new_pass: '',
    re_new_pass: '',
  });

  const getUser = async () => {
    try {
      const res = await api.get('/khach-hang/lay-du-lieu-profile');
      if (res.data.status) {
        setUser(res.data.obj_user);
      } else {
        // DisplayError(res);
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?.ho_va_ten && !fullName) {
      setFullName(user.ho_va_ten);
    }
    if (user?.so_dien_thoai && !phone) {
      setPhone(user.so_dien_thoai);
    }
  }, [user]);

  const handleUpdateInfo = async () => {
    try {
      const res = await api.put('/khach-hang/doi-thong-tin',
        {
          id: user.id,
          ho_va_ten: fullName,
          so_dien_thoai: phone,
          avatar: user.avatar,
        }
      );
      if (res.data.status) {
        navigation.goBack();
        Toast.show({
          type: 'success',
          text2: res.data.message,
        });

      } else {
        console.log(res)
      }
    } catch (error: any) {
      console.log(error.response.data.errors);
      setErrors(error.response.data.errors);
    }
  };
  console.log(errors);

  const validatePassword = () => {
    let isValid = true;
    const newErrors = {
      ...errors,
      old_pass: '',
      new_pass: '',
      re_new_pass: '',
    };

    if (!old_pass) {
      newErrors.old_pass = 'Vui lòng nhập mật khẩu hiện tại';
      isValid = false;
    }

    if (!new_pass) {
      newErrors.new_pass = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (new_pass.length < 6) {
      newErrors.new_pass = 'Mật khẩu mới phải có ít nhất 6 ký tự';
      isValid = false;
    } else if (old_pass === new_pass) {
      newErrors.new_pass =
        'Mật khẩu mới không được trùng với mật khẩu hiện tại';
      isValid = false;
    }

    if (!re_new_pass) {
      newErrors.re_new_pass = 'Vui lòng xác nhận mật khẩu mới';
      isValid = false;
    } else if (new_pass !== re_new_pass) {
      newErrors.re_new_pass = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {

    try {
      const payload = {
        id: user.id,
        re_new_pass: re_new_pass,
        old_pass: old_pass,
        new_pass: new_pass,
        email: user.email,
      }
      console.log(payload);
      const res = await api.put('/khach-hang/doi-mat-khau', payload);
      if (res.data.status) {
        navigation.goBack();
        Toast.show({
          type: 'success',
          text2: res.data.message,
        });
      } else {
        console.log(res);
      }
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
            <Text style={styles.headerSubtitle}>
              Cập nhật thông tin cá nhân của bạn
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}>
          <Icon
            name="account-edit"
            size={24}
            color={activeTab === 'info' ? '#FF4500' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'info' && styles.activeTabText,
            ]}>
            Thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'password' && styles.activeTab]}
          onPress={() => setActiveTab('password')}>
          <Icon
            name="lock"
            size={24}
            color={activeTab === 'password' ? '#FF4500' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'password' && styles.activeTabText,
            ]}>
            Mật khẩu
          </Text>
        </TouchableOpacity>
      </View>

      <Surface style={styles.contentCard}>
        {activeTab === 'info' ? (
          <View>
            <Text style={styles.sectionTitle}>Cập nhật thông tin cá nhân</Text>
            <TextInput
              mode="outlined"
              // error={errors.fullName}
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FF4500',

                  text: '#FFFFFF',
                  placeholder: '#9E9E9E',
                },
              }}
              textColor="#FFFFFF"
              placeholderTextColor="#9E9E9E"
              left={<TextInput.Icon icon="account" color="#FFFFFF" />}
            />
            {errors.ho_va_ten ? (
              <Text style={styles.errorText}>{errors.ho_va_ten}</Text>
            ) : null}
            <TextInput
              mode="outlined"
              // error={errors.phone}
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FF4500',
                  text: '#FFFFFF',
                  placeholder: '#9E9E9E',
                },
              }}
              textColor="#FFFFFF"
              placeholderTextColor="#9E9E9E"
              left={<TextInput.Icon icon="phone" color="#FFFFFF" />}
            />
            {errors.so_dien_thoai ? (
              <Text style={styles.errorText}>{errors.so_dien_thoai}</Text>
            ) : null}
            <Button
              mode="contained"
              onPress={handleUpdateInfo}
              style={styles.button}
              labelStyle={styles.buttonText}>
              Cập nhật thông tin
            </Button>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
            <TextInput
              mode="outlined"
              label="Mật khẩu hiện tại"
              value={old_pass}
              onChangeText={text => {
                setold_pass(text);
                setErrors({ ...errors, old_pass: '' });
              }}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FF4500',
                  text: '#FFFFFF',
                  placeholder: '#9E9E9E',
                },
              }}
              textColor="#FFFFFF"
              placeholderTextColor="#9E9E9E"
              left={<TextInput.Icon icon="lock" color="#FFFFFF" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#FFFFFF"
                />
              }
            />
            {errors.old_pass ? (
              <Text style={styles.errorText}>{errors.old_pass}</Text>
            ) : null}
            <TextInput
              mode="outlined"
              label="Mật khẩu mới"
              value={new_pass}
              onChangeText={text => {
                setnew_pass(text);
                setErrors({ ...errors, new_pass: '' });
              }}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FF4500',
                  text: '#FFFFFF',
                  placeholder: '#9E9E9E',
                },
              }}
              textColor="#FFFFFF"
              placeholderTextColor="#9E9E9E"
              left={<TextInput.Icon icon="lock-plus" color="#FFFFFF" />}
            />
            {errors.new_pass ? (
              <Text style={styles.errorText}>{errors.new_pass}</Text>
            ) : null}
            <TextInput
              mode="outlined"
              label="Xác nhận mật khẩu mới"
              value={re_new_pass}
              onChangeText={text => {
                setre_new_pass(text);
                setErrors({ ...errors, re_new_pass: '' });
              }}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FF4500',
                  text: '#FFFFFF',
                  placeholder: '#9E9E9E',
                },
              }}
              textColor="#FFFFFF"
              placeholderTextColor="#9E9E9E"
              left={<TextInput.Icon icon="lock-check" color="#FFFFFF" />}
            />
            {errors.re_new_pass ? (
              <Text style={styles.errorText}>{errors.re_new_pass}</Text>
            ) : null}
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              labelStyle={styles.buttonText}>
              Đổi mật khẩu
            </Button>
          </View>
        )}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255,69,0,0.1)',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF4500',
  },
  contentCard: {
    backgroundColor: '#161616',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#FF4500',
    marginTop: 16,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 12,
  },
});
