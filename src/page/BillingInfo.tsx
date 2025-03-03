import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useCallback } from 'react';
import api from '../utils/api';

interface Bill {
  ma_hoa_don: string;
  ten_goi: string;
  tong_tien: number;
  trang_thai: string;
  ngay_tao: string;
  ngay_het_han: string;
}

export default function BillingInfo({ navigation }: { navigation: any }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getBills = async () => {
    try {
      const res = await api.get('/khach-hang/lay-danh-sach-hoa-don');
      if (res.data.status) {
        setBills(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBills().finally(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    getBills();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã thanh toán':
        return '#4CAF50';
      case 'chưa thanh toán':
        return '#FF9800';
      case 'hết hạn':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Thông tin hóa đơn</Text>
            <Text style={styles.headerSubtitle}>Lịch sử giao dịch của bạn</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bills.map((bill, index) => (
          <Surface key={bill.ma_hoa_don} style={styles.billCard}>
            <View style={styles.billHeader}>
              <View style={styles.billIdContainer}>
                <Icon name="file-document-outline" size={20} color="#FF4500" />
                <Text style={styles.billId}>{bill.ma_hoa_don}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(bill.trang_thai) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(bill.trang_thai) },
                  ]}
                >
                  {bill.trang_thai}
                </Text>
              </View>
            </View>

            <View style={styles.billContent}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Tên gói:</Text>
                <Text style={styles.billValue}>{bill.ten_goi}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Tổng tiền:</Text>
                <Text style={styles.billAmount}>{formatMoney(bill.tong_tien)}</Text>
              </View>
              <View style={styles.billDates}>
                <View style={styles.dateContainer}>
                  <Icon name="calendar-start" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    {formatDate(bill.ngay_tao)}
                  </Text>
                </View>
                <Icon name="arrow-right" size={16} color="#666" />
                <View style={styles.dateContainer}>
                  <Icon name="calendar-end" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    {formatDate(bill.ngay_het_han)}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  billCard: {
    backgroundColor: '#161616',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billId: {
    color: '#FF4500',
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  billContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billLabel: {
    color: '#999',
    fontSize: 14,
  },
  billValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  billAmount: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  billDates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#666',
    fontSize: 13,
    marginLeft: 4,
  },
});

