import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../utils/api';
import SCREEN_NAME from '../share/menu';

// Định nghĩa kiểu dữ liệu Movie
interface Movie {
  id: number;
  slug_phim: string;
  ten_phim: string;
  hinh_anh: string;
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

interface MovieSectionProps {
  title: string;
  data: Movie[];
  type: 'new' | 'hot';
  onViewAll: () => void;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  // Get window dimensions for responsive design
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const CARD_WIDTH = windowWidth * 0.42;
  const CARD_HEIGHT = CARD_WIDTH * 1.5;
  const SPACING = windowWidth * 0.03; // 3% of screen width
  const isSmallDevice = windowHeight < 700;

  // State management
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hotMovies, setHotMovies] = useState<Movie[]>([]);
  const [mostViewedMovies, setMostViewedMovies] = useState<Movie[]>([]);
  const [completedMovies, setCompletedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  // Fetch genres data
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

  // Fetch movies data
  const fetchMoviesData = useCallback(async () => {
    try {
      const response = await api.get('phim/lay-du-lieu-show');
      const data = response.data;

      setMovies(data.phim_moi_cap_nhats || []);
      setHotMovies(data.phim_hot || []);
      setCompletedMovies(data.tat_ca_phim_hoan_thanh || []);
      setMostViewedMovies(data.phim_xem_nhieu_nhat || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Không thể tải danh sách phim');
      setLoading(false);
    }
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchMoviesData(), getGenres()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchMoviesData, getGenres]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchMoviesData(), getGenres()]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Không thể tải dữ liệu, vui lòng thử lại');
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchMoviesData, getGenres]);

  // Navigation handlers
  const navigateToMovieDetail = useCallback((slug: string) => {
    navigation.navigate('DetailFilm', { movieSlug: slug });
  }, [navigation]);

  const navigateToAllFilms = useCallback(() => {
    navigation.navigate(SCREEN_NAME.ALL_FILM);
  }, [navigation]);

  const navigateToGenreFilm = useCallback((genre: any) => {
    navigation.navigate('GenreFilm', {
      slug: genre.slug,
      ten_the_loai: genre.name
    });
  }, [navigation]);

  const navigateToVIP = useCallback(() => {
    navigation.navigate('GoiVip');
  }, [navigation]);

  // Render movie card
  const renderMovieCard = useCallback((item: Movie, type: 'new' | 'hot', index: number) => {
    if (!item || !item.hinh_anh) {
      return null;
    }

    const isFirstItem = index === 0;

    return (
      <TouchableOpacity
        style={[
          styles.cardContainer,
          { 
            width: CARD_WIDTH, 
            marginLeft: isFirstItem ? SPACING : SPACING / 2 
          }
        ]}
        activeOpacity={0.8}
        onPress={() => navigateToMovieDetail(item.slug_phim)}
      >
        <View style={[styles.card, { height: CARD_HEIGHT }]}>
          <View style={styles.imageContainer}>
            {loadingImages[item.id] && (
              <ActivityIndicator
                style={styles.imageLoader}
                size="small"
                color="#FF4500"
              />
            )}
            <Image
              source={{ uri: item.hinh_anh }}
              style={styles.movieImage}
              onLoadStart={() => setLoadingImages(prev => ({ ...prev, [item.id]: true }))}
              onLoadEnd={() => setLoadingImages(prev => ({ ...prev, [item.id]: false }))}
              resizeMode="cover"
              onError={() => setLoadingImages(prev => ({ ...prev, [item.id]: false }))}
            />
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradientOverlay}
          />
          <View style={styles.cardContent}>
            <Text style={styles.movieTitle} numberOfLines={2}>{item.ten_phim}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, type === 'hot' ? styles.hotBadge : styles.newBadge]}>
                <Text style={styles.badgeText}>{type === 'hot' ? 'HOT' : 'MỚI'}</Text>
              </View>
            </View>
          </View>

          {/* Play Button Overlay */}
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => navigateToMovieDetail(item.slug_phim)}
            >
              <Icon name="play" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [CARD_HEIGHT, CARD_WIDTH, SPACING, loadingImages, navigateToMovieDetail]);

  // Render featured movie
  const renderFeaturedMovie = useCallback((item: Movie) => {
    if (!item || !item.hinh_anh) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.featuredContainer}
        activeOpacity={0.9}
        onPress={() => navigateToMovieDetail(item.slug_phim)}
      >
        <View style={styles.featuredImageContainer}>
          {loadingImages['featured'] && (
            <ActivityIndicator
              style={styles.featuredImageLoader}
              size="large"
              color="#FF4500"
            />
          )}
          <Image
            source={{ uri: item.hinh_anh }}
            style={styles.featuredImage}
            onLoadStart={() => setLoadingImages(prev => ({ ...prev, featured: true }))}
            onLoadEnd={() => setLoadingImages(prev => ({ ...prev, featured: false }))}
            resizeMode="cover"
            onError={() => setLoadingImages(prev => ({ ...prev, featured: false }))}
          />
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{item.ten_phim}</Text>
            <View style={styles.featuredActions}>
              <TouchableOpacity
                style={styles.playNowButton}
                onPress={() => navigateToMovieDetail(item.slug_phim)}
              >
                <Icon name="play" size={16} color="#FFFFFF" />
                <Text style={styles.playNowText}>Xem ngay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addToFavButton}>
                <Icon name="bookmark-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [loadingImages, navigateToMovieDetail]);

  // Movie section component
  const MovieSection = useCallback(({ title, data, type, onViewAll }: MovieSectionProps) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => renderMovieCard(item, type, index)}
          contentContainerStyle={[styles.movieList, { paddingRight: SPACING }]}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>
    );
  }, [renderMovieCard]);

  // Category tabs component
  const CategoryTabs = useCallback(() => {
    const allCategories = [
      { id: 'all', name: 'Tất cả' },
      ...genres.map(genre => ({
        id: genre.id.toString(),
        name: genre.ten_the_loai,
        slug: genre.slug_the_loai
      }))
    ];

    return (
      <View style={styles.categoryTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          {allCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeTab === category.id && styles.activeTab
              ]}
              onPress={() => {
                setActiveTab(category.id);
                if (category.id === 'all') {
                  navigateToAllFilms();
                } else {
                  navigateToGenreFilm(category);
                }
              }}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  activeTab === category.id && styles.activeTabText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }, [genres, activeTab, navigateToAllFilms, navigateToGenreFilm]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Đang tải phim...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <Icon name="alert-circle-outline" size={60} color="#FF4500" />
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchMoviesData();
            getGenres();
          }}
        >
          Thử lại
        </Button>
      </View>
    );
  }

  // Animated header for scrolling
  const AnimatedHeader = () => (
    <Animated.View style={[
      styles.animatedHeader,
      { opacity: headerOpacity }
    ]}>
      <View style={styles.headerContent}>
        <Image source={require('../assets/image/logoW.png')} style={styles.logoImageSmall} />
        <View style={styles.headerActions}>
          <IconButton icon="magnify" size={24} iconColor="#FFFFFF" onPress={() => {}} />
          <IconButton icon="bell-outline" size={24} iconColor="#FFFFFF" onPress={() => {}} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <AnimatedHeader />

      {/* Main Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isSmallDevice ? 60 : 80 }
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF4500"
            colors={['#FF4500']}
          />
        }
      >
        {/* Main Header */}
        <View style={styles.mainHeader}>
          <View style={styles.headerTop}>
            <Image source={require('../assets/image/logoW.png')} style={styles.logoImage} />
            <View style={styles.headerActions}>
              <IconButton icon="magnify" size={26} iconColor="#FFFFFF" onPress={() => {}} />
              <IconButton icon="bell-outline" size={26} iconColor="#FFFFFF" onPress={() => {}} />
              <TouchableOpacity style={styles.profileButton} onPress={navigateToVIP}>
                <LinearGradient
                  colors={['#FF4500', '#FF8C00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.profileGradient}
                >
                  <Icon name="crown" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
            <Text style={styles.mainTitle}>Khám phá bộ phim yêu thích của bạn</Text>
          </View>

          {/* Category Tabs */}
          <CategoryTabs />
        </View>

        {/* Featured Movie */}
        {mostViewedMovies.length > 0 && renderFeaturedMovie(mostViewedMovies[0])}

        {/* Movie Sections */}
        <MovieSection
          title="Phim xem nhiều nhất"
          data={mostViewedMovies}
          type="hot"
          onViewAll={navigateToAllFilms}
        />

        <MovieSection
          title="Phim mới cập nhật"
          data={movies}
          type="new"
          onViewAll={navigateToAllFilms}
        />

        <MovieSection
          title="Phim đã hoàn thành"
          data={completedMovies}
          type="hot"
          onViewAll={navigateToAllFilms}
        />

        <MovieSection
          title="Đề xuất cho bạn"
          data={hotMovies}
          type="hot"
          onViewAll={navigateToAllFilms}
        />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
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
  retryButton: {
    backgroundColor: '#FF4500',
    marginTop: 20,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: StatusBar.currentHeight || 0,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 60 + (StatusBar.currentHeight || 0),
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  mainHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 35,
    resizeMode: 'contain',
  },
  logoImageSmall: {
    width: 80,
    height: 28,
    resizeMode: 'contain',
  },
  profileButton: {
    marginLeft: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryTabsContainer: {
    marginTop: 16,
  },
  categoryTabs: {
    paddingRight: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#FF4500',
  },
  categoryTabText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  featuredContainer: {
    marginTop: 20,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  featuredImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  featuredImageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredContent: {
    width: '100%',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 12,
  },
  playNowText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addToFavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: '500',
  },
  movieList: {
    paddingRight: 12,
  },
  cardContainer: {
    marginRight: 6,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageContainer: {
    height: '100%',
    position: 'relative',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hotBadge: {
    backgroundColor: '#FF4500',
  },
  newBadge: {
    backgroundColor: '#00C853',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 69, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Home;
