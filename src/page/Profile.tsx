import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../utils/api';
import { removeToken } from '../utils/TokenManager';
import { DisplayError } from '../../general/Notification';

interface User {
  id: number;
  ho_va_ten: string;
  email: string;
  so_dien_thoai: string;
  avatar: string;
  id_goi_vip: number;
}

export default function PageProfile({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    removeToken();
    navigation.navigate('Login');
  };

  const getUser = async () => {
    try {
      const res = await api.get('/khach-hang/lay-du-lieu-profile');
      if (res.data.status) {
        setUser(res.data.obj_user);
      } else {
        DisplayError(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            // source={user?.avatar ? { uri: user.avatar } : require('../assets/image/avatar-default.png')}
            style={styles.avatar}
            source={{ uri: user?.avatar }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.ho_va_ten || 'Người dùng'}</Text>
            <Text style={styles.userStatus}>
              {user?.id_goi_vip ? 'Thành viên VIP' : 'Thành viên thường'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        {!user?.id_goi_vip && (
          <Button
            mode="contained"
            style={styles.upgradeButton}
            labelStyle={styles.upgradeButtonText}
            icon="crown"
            onPress={() => navigation.navigate('GoiVip')}
          >
            Nâng cấp VIP ngay
          </Button>
        )}
      </View>

   

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('PageProfile')}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="account-outline" size={24} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Thông tin tài khoản</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('BillingInfo')}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="credit-card-outline" size={24} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Thông tin hóa đơn</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('WatchHistory')}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="history" size={24} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Lịch sử xem</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('PageSetting')}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="cog-outline" size={24} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Cài đặt</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity> */}

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="logout" size={24} color="#FF4500" />
          </View>
          <Text style={[styles.menuText, styles.logoutText]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FF4500',
    backgroundColor: '#2A2A2A',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#999',
  },
  upgradeButton: {
    backgroundColor: '#FF4500',
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#161616',
    marginTop: 12,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  statItem: {
    alignItems: 'center',
    width: width / 3 - 32,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,69,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 12,
    backgroundColor: '#161616',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#FF4500',
    fontWeight: '600',
  },
});
