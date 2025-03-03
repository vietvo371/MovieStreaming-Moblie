import React, { useState } from 'react';
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
import api from '../utils/api';
import { DisplayError } from '../../general/Notification';

const { width } = Dimensions.get('window');

export default function PageProfile({ navigation }: { navigation: any }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'

  const handleUpdateInfo = async () => {
    if (!fullName || !phone) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const res = await api.post('/khach-hang/cap-nhat-thong-tin', {
        ho_va_ten: fullName,
        so_dien_thoai: phone,
      });
      if (res.data.status) {
        navigation.goBack();
      } else {
        DisplayError(res);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    try {
      const res = await api.post('/khach-hang/doi-mat-khau', {
        mat_khau_cu: currentPassword,
        mat_khau_moi: newPassword,
      });
      if (res.data.status) {
        navigation.goBack();
      } else {
        DisplayError(res);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
            <Text style={styles.headerSubtitle}>Cập nhật thông tin cá nhân của bạn</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Icon 
            name="account-edit" 
            size={24} 
            color={activeTab === 'info' ? '#FF4500' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'password' && styles.activeTab]}
          onPress={() => setActiveTab('password')}
        >
          <Icon 
            name="lock" 
            size={24} 
            color={activeTab === 'password' ? '#FF4500' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>
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
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              theme={{ colors: { primary: '#FF4500' } }}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              mode="outlined"
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              theme={{ colors: { primary: '#FF4500' } }}
              left={<TextInput.Icon icon="phone" />}
            />
            <Button
              mode="contained"
              onPress={handleUpdateInfo}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Cập nhật thông tin
            </Button>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
            <TextInput
              mode="outlined"
              label="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{ colors: { primary: '#FF4500' } }}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              mode="outlined"
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{ colors: { primary: '#FF4500' } }}
              left={<TextInput.Icon icon="lock-plus" />}
            />
            <TextInput
              mode="outlined"
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{ colors: { primary: '#FF4500' } }}
              left={<TextInput.Icon icon="lock-check" />}
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
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
}); 