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
  tenPhim: string;
  slug: string;
  poster: string;
  thoiGianXem: string;
  thoiLuongDaXem: number;
  thoiLuongPhim: number;
  tapPhim: number;
  ngayXem: string;
}

export default function WatchHistory({ navigation }: { navigation: any }) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getWatchHistory = async () => {
    try {
      const res = await api.get('/khach-hang/lich-su-xem');
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
    if (!minutes) return '0p';
    
    const randomMinutes = Math.floor(Math.random() * minutes) + 1;
    const hours = Math.floor(randomMinutes / 60);
    const remainingMinutes = randomMinutes % 60;
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
            onPress={() => navigation.navigate('DetailFilm', { movieSlug: item.slug })}
          >
            <Surface style={styles.historyCard}>
              <Image
                source={{ uri: item.poster }}
                style={styles.poster}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {item.tenPhim}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${calculateProgress(item.thoiLuongDaXem, item.thoiLuongPhim)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.durationText}>
                    {formatDuration(item.thoiLuongPhim)} /{' '}
                    {formatDuration(item.thoiLuongPhim)}
                  </Text>
                </View>
                <View style={styles.bottomInfo}>
                  <Text style={styles.dateText}>
                    <Icon name="clock-outline" size={14} color="#666" />{' '}
                    {formatDate(item.ngayXem)}
                  </Text>
                  {item.tapPhim && (
                    <Text style={styles.episodeText}>Tập {item.tapPhim}</Text>
                  )}
                </View>
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  poster: {
    width: 100,
    height: 140,
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
    marginBottom: 8,
    lineHeight: 22,
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1.5,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 1.5,
  },
  durationText: {
    fontSize: 12,
    color: '#999',
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  episodeText: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,69,0,0.1)',
    borderRadius: 4,
  },
});   
