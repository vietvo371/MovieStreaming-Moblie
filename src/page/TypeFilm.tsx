import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../utils/api';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

interface Movie {
  id: number;
  slug_phim: string;
  ten_phim: string;
  hinh_anh: string;
  tong_luot_xem: number;
  so_tap_phim: number;
  tong_tap: number;
  ten_the_loais: string;
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF4500" />
  </View>
);

const TypeFilm = ({ route, navigation }: any) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 9
  });
  const [refreshing, setRefreshing] = useState(false);
  const { slug } = route.params;
  const { ten_loai_phim } = route.params;
  // const { Ty } = route.params;

  const fetchMovies = async (pageNumber: number, isRefresh = false) => {
    try {
      const response = await api.get(`loai-phim/lay-du-lieu-show-tat-ca/${slug}?page=${pageNumber}`);
      const newMovies = response.data.phim.dataPhim.data;
      const paginationData = {
        current_page: response.data.phim.dataPhim.current_page,
        last_page: response.data.phim.dataPhim.last_page,
        total: response.data.phim.pagination.total,
        per_page: response.data.phim.pagination.per_page
      };
      
      if (isRefresh) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }
      
      setPagination(paginationData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, [slug]);

  const handleLoadMore = () => {
    if (!loading && pagination.current_page < pagination.last_page) {
      const nextPage = pagination.current_page + 1;
      fetchMovies(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovies(1, true);
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailFilm', { movieSlug: item.slug_phim })}
    >
      <Image source={{ uri: item.hinh_anh }} style={styles.movieImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.ten_phim}
        </Text>
        <View style={styles.movieInfo}>
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityText}>{item.tong_tap}/{item.so_tap_phim} tập</Text>
          </View>
          <View style={styles.viewCount}>
            <Icon name="eye" size={14} color="#999999" />
            <Text style={styles.yearText}> {item.tong_luot_xem}</Text>
          </View>
        </View>
        <Text style={styles.genreText} numberOfLines={1}>
          {item.ten_the_loais}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  };

  if (loading && movies.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách phim {ten_loai_phim}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#161616',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  movieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityBadge: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qualityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yearText: {
    color: '#999999',
    fontSize: 12,
  },
  genreText: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    paddingVertical: 20,
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TypeFilm; 