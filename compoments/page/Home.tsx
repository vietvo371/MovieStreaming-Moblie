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
import DetailFilm from './DetailFilm';


const API_URL = 'https://wopai-be.dzfullstack.edu.vn/api/phim/lay-du-lieu-show';

function Home({ navigation }: { navigation: NavigationProp<any> }) {
  interface Movie {
    id: number;
    slug_phim: string;
    ten_phim: string;
    hinh_anh: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [hot_movies, setHotMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Data:', data);
        setMovies(data.phim_moi_cap_nhats);
        setHotMovies(data.phim_hot);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/image/logoW.png')} style={styles.logoImage} />
        <Text style={styles.vipText}>🔴 Đăng ký VIP ngay!</Text>
      </View>

      {/* Danh sách truyện */}
      <ScrollView>
        <Text style={styles.sectionTitle}>Phim mới cập nhật</Text>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => navigation.navigate('DetailFilm', { movieSlug: item.slug_phim})}>
              <Card.Cover source={{ uri: item.hinh_anh }} style={styles.movieImage} />
              <Card.Content>
                <Text style={styles.movieTitle}>{item.ten_phim}</Text>
              </Card.Content>
            </Card>
          )}
        />

        <Text style={styles.sectionTitle}>Đề xuất cho bạn</Text>
        <FlatList
          data={hot_movies}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => navigation.navigate('DetailFilm', { movieSlug: item.slug_phim })}>
              <Card.Cover source={{ uri: item.hinh_anh }} style={styles.movieImage} />
              <Card.Content>
                <Text style={styles.movieTitle}>{item.ten_phim}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  logoImage: {
    width: 120, // 100% width
    height: 40,
  },
  vipText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginRight: 10,
    width: 140,
    borderRadius: 10,
    overflow: 'hidden',
  },
  movieImage: {
    height: 200,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
