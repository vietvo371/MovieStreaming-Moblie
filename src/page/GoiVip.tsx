import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { NavigationProp } from '@react-navigation/native';
import SCREEN_NAME from '../share/menu';

interface VIPPackage {
  id: number;
  ten_goi: string;
  slug_goi_vip: string;
  thoi_han: number;
  tien_goc: number;
  tien_sale: number;
  tinh_trang: number;
}

const GoiVip = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [packages, setPackages] = useState<VIPPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVIPPackages();
  }, []);

  const fetchVIPPackages = async () => {
    try {
      const response = await axios.get('https://wopai-be.dzfullstack.edu.vn/api/lay-data-goi-vip-open');
      setPackages(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  const handlePurchase = (pkg: VIPPackage) => {
    navigation.navigate(SCREEN_NAME.PAYMENT_METHOD, { packageInfo: pkg });
  };

  const renderPackage = (pkg: VIPPackage) => (
    <View key={pkg.id} style={styles.packageContainer}>
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <View>
            <Text style={styles.packageName}>{pkg.ten_goi}</Text>
            <Text style={styles.duration}>{pkg.thoi_han} tháng</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{calculateDiscount(pkg.tien_goc, pkg.tien_sale)}%
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{formatPrice(pkg.tien_goc)}</Text>
          <Text style={styles.salePrice}>{formatPrice(pkg.tien_sale)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Icon name="movie" size={24} color="#FF4500" />
            <Text style={styles.featureText}>Xem phim chất lượng 4K</Text>
          </View>
          <View style={styles.featureRow}>
            <Icon name="devices" size={24} color="#FF4500" />
            <Text style={styles.featureText}>Xem trên nhiều thiết bị</Text>
          </View>
          <View style={styles.featureRow}>
            <Icon name="block" size={24} color="#FF4500" />
            <Text style={styles.featureText}>Không quảng cáo</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchase(pkg)}
        >
          <Text style={styles.buttonText}>NÂNG CẤP NGAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/image/logoW.png')}
      style={styles.container}
      blurRadius={5}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Nâng cấp VIP</Text>
              <Text style={styles.headerSubtitle}>
                Trải nghiệm giải trí không giới hạn
              </Text>
            </View>
            <View style={styles.placeholderView} />
          </View>
          <ScrollView style={styles.scrollView}>
            {packages.map(renderPackage)}
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderView: {
    width: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  scrollView: {
    padding: 16,
  },
  packageContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  packageContent: {
    padding: 20,
    backgroundColor: 'rgba(45, 52, 54, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  discountBadge: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',

    fontWeight: 'bold',
    fontSize: 16,
  },
  priceContainer: {
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 16,
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
    opacity: 0.6,
    marginBottom: 4,
  },
  salePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  purchaseButton: {
    backgroundColor: '#FF4500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default GoiVip;
