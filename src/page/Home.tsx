import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  RefreshControl,
  Platform,
  useWindowDimensions,
  ImageBackground,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import api from '../utils/api';
import SCREEN_NAME from '../share/menu';

// Lấy kích thước màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Định nghĩa kiểu dữ liệu Movie
interface Movie {
  id: number;
  slug_phim: string;
  ten_phim: string;
  hinh_anh: string;
  thoi_luong?: string;
  the_loai?: string;
  nam_phat_hanh?: string;
  quoc_gia?: string;
  tong_luot_xem?: number;
  ten_the_loais?: string;
}

interface Genre {
  id: number;
  ten_the_loai: string;
  slug_the_loai: string;
  tinh_trang: number;
}

// Định nghĩa kiểu dữ liệu cho props của component
interface HomeProps {
  navigation: NavigationProp<any>;
}

interface MovieRowProps {
  title: string;
  data: Movie[];
  onViewAll: () => void;
  onSelectMovie: (slug: string) => void;
  showRank?: boolean;
  type?: 'poster' | 'landscape';
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  // State management
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hotMovies, setHotMovies] = useState<Movie[]>([]);
  const [mostViewedMovies, setMostViewedMovies] = useState<Movie[]>([]);
  const [completedMovies, setCompletedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Fetch data
  const fetchMoviesData = useCallback(async () => {
    try {
      const response = await api.get('phim/lay-du-lieu-show');
      const data = response.data;
      console.log(data);

      setMovies(data.phim_moi_cap_nhats || []);
      setHotMovies(data.phim_hot || []);
      setCompletedMovies(data.tat_ca_phim_hoan_thanh || []);
      setMostViewedMovies(data.phim_xem_nhieu_nhat || []);
      setGenres(data.ten_the_loais || []);
      
      // Set featured movie (first hot movie or most viewed)
      if (data.phim_hot && data.phim_hot.length > 0) {
        setFeaturedMovie(data.phim_hot[0]);
      } else if (data.phim_xem_nhieu_nhat && data.phim_xem_nhieu_nhat.length > 0) {
        setFeaturedMovie(data.phim_xem_nhieu_nhat[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Không thể tải danh sách phim');
      setLoading(false);
    }
  }, []);

  const getGenres = useCallback(async () => {
    try {
      const response = await api.get('lay-data-the-loai-home');
      if (response.data && response.data.the_loai) {
        setGenres(response.data.the_loai);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, []);

  useEffect(() => {
    fetchMoviesData();
    getGenres();
  }, [fetchMoviesData, getGenres]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchMoviesData(), getGenres()])
      .finally(() => setRefreshing(false));
  }, [fetchMoviesData, getGenres]);

  // Navigation handlers
  const navigateToMovieDetail = useCallback((slug: string) => {
    navigation.navigate('DetailFilm', { movieSlug: slug });
  }, [navigation]);

  const navigateToAllFilms = useCallback(() => {
    navigation.navigate(SCREEN_NAME.ALL_FILM);
  }, [navigation]);

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const navigateToNotifications = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const navigateToVIP = useCallback(() => {
    navigation.navigate('GoiVip');
  }, [navigation]);

  // Function to validate image URL
  const getValidImageUrl = useCallback((url: string) => {
    return { uri: url };
  }, []);

  // Movie Row component
  const MovieRow: React.FC<MovieRowProps> = useCallback(({
    title,
    data,
    onViewAll,
    onSelectMovie,
    showRank = false,
    type = 'poster'
  }) => {
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.movieSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={onViewAll}
          >
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={data.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[
                styles.movieCard,
                type === 'landscape' && styles.movieCardLandscape
              ]}
              activeOpacity={0.7}
              onPress={() => onSelectMovie(item.slug_phim)}
            >
              <View style={styles.movieImageContainer}>
                <Image
                  source={getValidImageUrl(item.hinh_anh)}
                  style={[
                    styles.movieImage,
                    type === 'landscape' && styles.movieImageLandscape
                  ]}
                  resizeMode="cover"
                />
                
                {showRank && (
                  <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                )}
                
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>
                    {item.tong_luot_xem} 
                  </Text>
                </View>
                
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.gradientOverlay}
                />
                
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    { showRank ? "" : item.ten_phim}
                  </Text>
                  {type === 'landscape' && (
                    <Text style={styles.movieCategory} numberOfLines={1}>
                    {item.ten_the_loais}
                    </Text>
                  )}
                </View>
                
                <View style={styles.playIconContainer}>
                  <Icon name="play-circle-outline" size={32} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }, [getValidImageUrl]);

  // Featured movie component
  const renderFeaturedMovie = useCallback(() => {
    if (!featuredMovie) return null;

    return (
      <View style={styles.featuredContainer}>
        <ImageBackground
          source={getValidImageUrl(featuredMovie.hinh_anh)}
          style={styles.featuredImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.featuredGradient}
          >
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>HOT</Text>
              </View>
              
              <Text style={styles.featuredTitle}>{featuredMovie.ten_phim}</Text>
              <Text style={styles.featuredSubtitle}>
                {featuredMovie.ten_the_loais}
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => navigateToMovieDetail(featuredMovie.slug_phim)}
                >
                  <Icon name="play" size={20} color="#FFFFFF" />
                  <Text style={styles.playText}>Xem phim</Text>
                </TouchableOpacity>
                
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }, [featuredMovie, getValidImageUrl, navigateToMovieDetail]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Đang tải phim...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Icon name="alert-circle-outline" size={60} color="#E50914" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchMoviesData();
            getGenres();
          }}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header - Transparent */}
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />
        
        <View style={styles.header}>
          <Image 
            source={require('../assets/image/logoW.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={navigateToSearch}
            >
              <Feather name="search" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={navigateToNotifications}
            >
              <Feather name="bell" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={navigateToVIP}
            >
              <LinearGradient
                colors={['#E50914', '#FF5722']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileGradient}
              >
                <Icon name="crown" size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <Animated.FlatList
        data={[1]}
        keyExtractor={() => "main"}
        renderItem={() => (
          <View style={styles.mainContent}>
            {renderFeaturedMovie()}
            
            <MovieRow
              title="Phim Xem Nhiều Nhất"
              data={mostViewedMovies}
              onViewAll={navigateToAllFilms}
              onSelectMovie={navigateToMovieDetail}
              showRank={true}
            />
            
            <MovieRow
              title="Phim Đề Xuất Cho Bạn"
              data={hotMovies}
              onViewAll={navigateToAllFilms}
              onSelectMovie={navigateToMovieDetail}
              type="landscape"
            />

            <MovieRow
              title="Phim Mới Cập Nhật"
              data={movies}
              onViewAll={navigateToAllFilms}
              onSelectMovie={navigateToMovieDetail}
            />
            
            <MovieRow
              title="Phim Đã Hoàn Thành"
              data={completedMovies}
              onViewAll={navigateToAllFilms}
              onSelectMovie={navigateToMovieDetail}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#E50914"
            colors={["#E50914"]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 60 + (StatusBar.currentHeight || 0) : 80,
    backgroundColor: '#0A0A0A',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 8,
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  mainContent: {
    flex: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  featuredContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.65,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredContent: {
    marginBottom: 24,
  },
  featuredBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredSubtitle: {
    fontSize: 15,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
    elevation: 4,
  },
  playText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  myListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  myListText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  movieSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#E50914',
    fontWeight: '500',
  },
  movieList: {
    paddingRight: 8,
  },
  movieCard: {
    width: 120,
    height: 180,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  movieCardLandscape: {
    width: 220,
    height: 130,
  },
  movieImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieImageLandscape: {
    borderRadius: 8,
  },
  rankContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
    width: 28,
    height: 28,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ratingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E50914',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
    zIndex: 10,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  movieInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  movieCategory: {
    color: '#CCCCCC',
    fontSize: 10,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
});

export default Home;
