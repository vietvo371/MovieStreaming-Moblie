import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Surface } from 'react-native-paper';
import { useState, useCallback } from 'react';
import api from '../utils/api';

const { width } = Dimensions.get('window');

interface WatchHistoryItem {
  id: number;
  ten_phim: string;
  thumbnail: string;
  thoi_gian_xem: string;
  thoi_luong_da_xem: number;
  thoi_luong_phim: number;
  tap_phim: number;
}

export default function WatchHistory({ navigation }: { navigation: any }) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getWatchHistory = async () => {
    try {
      const res = await api.get('/khach-hang/lay-lich-su-xem');
      if (res.data.status) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getWatchHistory().finally(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    getWatchHistory();
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}p`;
    }
    return `${remainingMinutes}p`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateProgress = (watched: number, total: number) => {
    return (watched / total) * 100;
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
            <Text style={styles.headerTitle}>Lịch sử xem</Text>
            <Text style={styles.headerSubtitle}>Danh sách phim bạn đã xem</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('DetailFilm', { id: item.id })}
          >
            <Surface style={styles.historyCard}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                // defaultSource={require('../assets/image/thumbnail-default.png')}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {item.ten_phim}
                </Text>
                <Text style={styles.episodeText}>
                  Tập {item.tap_phim}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${calculateProgress(
                            item.thoi_luong_da_xem,
                            item.thoi_luong_phim
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.durationText}>
                    {formatDuration(item.thoi_luong_da_xem)} /{' '}
                    {formatDuration(item.thoi_luong_phim)}
                  </Text>
                </View>
                <Text style={styles.dateText}>
                  <Icon name="clock-outline" size={14} color="#666" />{' '}
                  {formatDate(item.thoi_gian_xem)}
                </Text>
              </View>
            </Surface>
          </TouchableOpacity>
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
  historyCard: {
    backgroundColor: '#161616',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 4,
  },
  thumbnail: {
    width: 120,
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  episodeText: {
    fontSize: 14,
    color: '#FF4500',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 2,
  },
  durationText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    alignItems: 'center',
  },
});   
