import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import{ api } from  '../utils/api';
import { DisplayError } from '../../general/Notification';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Movie {
  id: number;
  slug_phim: string;
  ten_phim: string;
  hinh_anh: string;
}

type RootStackParamList = {
  DetailFilm: { movieSlug: string };
  Home: undefined;
};

// const API_URL = 'https://wopai-be.dzfullstack.edu.vn/api/phim/lay-du-lieu-show';

const WatchlistPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWatchlist = async () => {
    api.get('/khach-hang/yeu-thich/lay-du-lieu').
    then((res) => {
      if (res.data.yeu_thich) {
        setMovies(res.data.yeu_thich);
        setLoading(false);
      } else {
        // DisplayError(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getWatchlist();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phim yêu thích</Text>
        <Text style={styles.headerSubtitle}>Danh sách phim bạn đã lưu</Text>
      </View>

      <ScrollView style={styles.content}>
        {movies.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="heart-outline" size={64} color="#FF4500" />
            <Text style={styles.emptyText}>Chưa có phim yêu thích</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseButtonText}>Khám phá phim</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.movieGrid}>
            {movies.map(movie => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieCard}
                onPress={() => navigation.navigate('DetailFilm', { movieSlug: movie.slug_phim })}
              >
                <Image source={{ uri: movie.hinh_anh }} style={styles.movieImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.gradient}
                >
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.ten_phim}
                  </Text>
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Thêm logic xóa khỏi yêu thích
                    }}
                  >
                    <Icon name="heart" size={24} color="#FF4500" />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: '#999',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  movieCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    padding: 12,
    justifyContent: 'flex-end',
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WatchlistPage; 