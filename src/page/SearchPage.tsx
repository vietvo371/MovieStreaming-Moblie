import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import{ api } from  '../utils/api';

const categories = [
  { id: 'single', name: 'Phim Lẻ', icon: 'movie-outline', slug: 'phim-le' },
  { id: 'series', name: 'Phim Bộ', icon: 'movie-roll', slug: 'phim-bo' },
  { id: 'anime', name: 'Hoạt Hình', icon: 'animation', slug: 'phim-hoat-hinh' },
];

// Add type for navigation
type RootStackParamList = {
  DetailFilm: { movieSlug: string };
  TypeFilm: { slug: string, ten_loai_phim: string };
  GenreFilm: { slug: string, ten_the_loai: string };
};

const SearchPage = () => {
  const [activeCategory, setActiveCategory] = useState('single');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  interface Movie {
    id: number;
    slug_phim: string;
    ten_phim: string;
    hinh_anh: string;
  }
 
  interface Genre {
    id: number;
    ten_the_loai: string,
    slug_the_loai: string,
    tinh_trang: number,
  }
  const [keySearch, setKeySearch] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [checkSearch, setCheckSearch] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hot_movies, setHotMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGenres = async () => {
    try {
      const response = await api.get('lay-data-the-loai-home');
      setGenres(response.data.the_loai);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const getMovies = async () => {
    try {
      const response = await api.get('phim/lay-du-lieu-show');
      if(response.status === 200){  
        setHotMovies(response.data.phim_hot);
        setLoading(false);
      }
    } catch (error) {
      // setError(error.message);
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    try {
      const response = await api.post(`phim/thong-tin-tim`, {
        key: keySearch
      });
      setMovies(response.data.phim);
    } catch (error) {
      // setError(error.message);
    }
  };
  useEffect(() => {
    getMovies();
    getGenres();
  }, []);

  useEffect(() => {
    if (keySearch.trim()) {
      setCheckSearch(true);
      const debounceSearch = setTimeout(() => {
        searchMovies();
      }, 500);

      return () => clearTimeout(debounceSearch);
    } else {
      setCheckSearch(false);
      setMovies([]);
    }
  }, [keySearch]);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm phim</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên phim..."
          placeholderTextColor="#666"
          value={keySearch}
          onChangeText={setKeySearch}
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => {
              setActiveCategory(category.id);
              navigation.navigate('TypeFilm', { slug: category.slug , ten_loai_phim: category.name});
            }}
          >
            <Icon
              name={category.icon}
              size={24}
              color={activeCategory === category.id ? '#FF4500' : '#FFF'}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Genres Grid */}
      <View style={styles.genresSection}>
        <Text style={styles.sectionTitle}>Thể Loại</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.genresRow}>
            {genres.map(genre => (
              <TouchableOpacity
                key={genre.id}
                style={styles.genreButton}
                onPress={() => navigation.navigate('GenreFilm', { 
                  slug: genre.slug_the_loai,
                  ten_the_loai: genre.ten_the_loai 
                })}
              >
                <Text style={styles.genreText}>{genre.ten_the_loai}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Movies Grid */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          {checkSearch ? 'Kết quả tìm kiếm' : 'Phổ biến'}
        </Text>
        <View style={styles.moviesGrid}>
          {checkSearch 
            ? movies.map(movie => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.movieCard}
                  onPress={() => navigation.navigate('DetailFilm', { movieSlug: movie.slug_phim ,})}
                >
                  <Image source={{ uri: movie.hinh_anh }} style={styles.movieImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                  />
                  <Text style={styles.movieTitle}>{movie.ten_phim}</Text>
                </TouchableOpacity>
              ))
            : hot_movies.map(movie => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.movieCard}
                  onPress={() => navigation.navigate('DetailFilm', { movieSlug: movie.slug_phim })}
                >
                  <Image source={{ uri: movie.hinh_anh }} style={styles.movieImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                  />
                  <Text style={styles.movieTitle}>{movie.ten_phim}</Text>
                </TouchableOpacity>
              ))
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontSize: 16,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(255,69,0,0.1)',
  },
  categoryText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FF4500',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  movieCard: {
    width: '50%',
    padding: 4,
    aspectRatio: 0.8,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  gradient: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  movieTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  genresSection: {
    marginBottom: 20,
  },
  genresRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  genreButton: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  genreText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SearchPage;