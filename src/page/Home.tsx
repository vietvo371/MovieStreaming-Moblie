import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../utils/api';
import SCREEN_NAME from '../share/menu';


function Home({ navigation }: { navigation: NavigationProp<any> }) {
  interface Movie {
    id: number;
    slug_phim: string;
    ten_phim: string;
    hinh_anh: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [hot_movies, setHotMovies] = useState<Movie[]>([]);
  const [phim_xem_nhieu_nhat, setPhimXemNhieuNhat] = useState<Movie[]>([]);
  const [done_movies, setDoneMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('phim/lay-du-lieu-show')
      .then((response) => {
        console.log('Fetched Data:', response.data);
        setMovies(response.data.phim_moi_cap_nhats);
        setHotMovies(response.data.phim_hot);
        setDoneMovies(response.data.tat_ca_phim_hoan_thanh);
        setPhimXemNhieuNhat(response.data.phim_xem_nhieu_nhat);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setError('Không thể tải danh sách phim');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderMovieCard = (item: Movie, type: 'new' | 'hot') => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DetailFilm', { movieSlug: item.slug_phim })}
    >
      <Card.Cover
        source={{ uri: item.hinh_anh }}
        style={styles.movieImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
      />
      <Card.Content style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.ten_phim}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, type === 'hot' ? styles.hotBadge : styles.newBadge]}>
            <Text style={styles.badgeText}>{type === 'hot' ? 'HOT' : 'MỚI'}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/image/logoW.png')} style={styles.logoImage} />
        <Button
          mode="contained"
          style={styles.vipButton}
          labelStyle={styles.vipButtonText}
          icon="crown"
          onPress={() => navigation.navigate('GoiVip')}
        >
          VIP
        </Button>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#FF4500', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroGradient}
          >
            <Text style={styles.mainTitle}>Khám phá</Text>
            <Text style={styles.heroText}>Thế giới giải trí không giới hạn</Text>
          </LinearGradient>
        </View>

        {/* Movie Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phim xem nhiều nhất</Text>
            <Button
              mode="text"
              textColor="#FF4500"
              onPress={() => navigation.navigate(SCREEN_NAME.ALL_FILM)}
            >
              Xem tất cả
            </Button>
          </View>
          <FlatList
            data={phim_xem_nhieu_nhat}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderMovieCard(item, 'hot')}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phim mới cập nhật</Text>
            <Button
              mode="text"
              textColor="#FF4500"
              onPress={() => navigation.navigate(SCREEN_NAME.ALL_FILM)}
            >
              Xem tất cả
            </Button>
          </View>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderMovieCard(item, 'new')}
          />
        </View>


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phim đã hoàn thành</Text>
            <Button
              mode="text"
              textColor="#FF4500"
              onPress={() => navigation.navigate('AllFilm')}
            >
              Xem tất cả
            </Button>
          </View>
          <FlatList
            data={done_movies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderMovieCard(item, 'hot')}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đề xuất cho bạn</Text>
            <Button
              mode="text"
              textColor="#FF4500"
              onPress={() => navigation.navigate('AllFilm')}
            >
              Xem tất cả
            </Button>
          </View>
          <FlatList
            data={hot_movies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderMovieCard(item, 'hot')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#161616',
    elevation: 4,
  },
  logoImage: {
    width: 100,
    height: 35,
    resizeMode: 'contain',
  },
  vipButton: {
    backgroundColor: '#FF4500',
    borderRadius: 20,
    elevation: 4,
  },
  vipButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroSection: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginLeft: 16,
    width: 160,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  movieImage: {
    height: 240,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
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
  errorText: {
    color: '#FF4500',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
