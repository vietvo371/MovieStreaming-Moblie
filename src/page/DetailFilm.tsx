import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SCREEN_NAME from '../share/menu';
import api from '../utils/api';

type MovieDetail = {
  id: number;
  ten_phim: string;
  ten_loai_phim: string;
  mo_ta: string;
  hinh_anh: string;
  nam_san_xuat: number;
  chat_luong: string;
  ngon_ngu: string;
  so_tap_phim: number;
  tong_tap: number;
  ten_the_loais: string;
  quoc_gia: string;
  dao_dien: string;
  trailer_url: string;
  slug_phim: string;
};

type DetailFilmProps = NativeStackScreenProps<any, 'DetailFilm'>;

const DetailFilm = ({ route, navigation }: DetailFilmProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [yeuThich, setYeuThich] = useState(false);
  const [checkUserTermed, setUserTermed] = useState(false);


  const checkYeuThich = async () => {
    const response = await api.post('khach-hang/yeu-thich/kiem-tra', {
      slug: movie?.slug_phim
    });
    console.log(response);
    if (response.data.status === true) {
      setYeuThich(true);
      setUserTermed(response.data.isUserTermed === true)
    }
    else {
      setYeuThich(false);
    }
  }
  const themYeuThich = async () => {
    try {
      const response = await api.post('khach-hang/yeu-thich/thong-tin-tao', {
        id_phim: movie?.id
      });
      console.log(response);
      if (response.data.status === true) {
        setYeuThich(true);
        console.log('them yeu thich thanh cong');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }

  }
  const xoaYeuThich = async () => {
    try {
      const response = await api.post('khach-hang/yeu-thich/thong-tin-xoa ', {
        id_phim: movie?.id
      });
      if (response.data.status === true) {
        console.log('xoa yeu thich thanh cong');
        setYeuThich(false);
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  }
  const getMovieDetail = async () => {
    try {
      const response = await api.post('phim/lay-data-delist', {
        slug: route.params?.movieSlug
      });
      setMovie(response.data.phim);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getMovieDetail();
  }, [route.params?.phim]);

  useEffect(() => {
    checkYeuThich();
  }, [movie]);


  console.log(checkUserTermed);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!movie) return null;

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Movie Poster Section */}
        <View style={styles.posterContainer}>
          <Image source={{ uri: movie.hinh_anh }} style={styles.posterImage} />
          <LinearGradient
            colors={['transparent', '#0D0D0D']}
            style={styles.gradientOverlay}
          />
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movie.ten_phim}</Text>
            <Text style={styles.originalTitle}>{movie.ten_loai_phim}</Text>
            <View style={styles.tags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.chat_luong}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.ngon_ngu}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.nam_san_xuat}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            style={styles.playButton}
            icon="play"
            onPress={() => navigation.navigate(SCREEN_NAME.WATCH_PAGE, { movieSlug: route.params?.movieSlug })}
          >
            Xem phim
          </Button>
          <Button
            mode="outlined"
            style={yeuThich ? styles.favoriteButton_active : styles.favoriteButton}
            icon={yeuThich ? 'heart' : 'heart-outline'}
            textColor="#FFF"
            onPress={() => {
              if (yeuThich) {
                xoaYeuThich();
              } else {
                themYeuThich();
              }
            }}
          >
            {yeuThich ? 'Đã thêm' : 'Yêu thích'}
          </Button>
        </View>

        {/* Episode Status */}
        <View style={styles.episodeStatus}>
          <Text style={styles.episodeText}>
            Tập {movie.so_tap_phim}/{movie.tong_tap}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Text style={styles.sectionTitle}>Thể loại</Text>
          <View style={styles.categoryTags}>
            {movie.ten_the_loais.split(', ').map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.sectionTitle}>Nội dung phim</Text>
          <Text style={styles.descriptionText}>
            {movie.mo_ta.replace(/<\/?[^>]+(>|$)/g, '')}
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đạo diễn:</Text>
            <Text style={styles.infoValue}>{movie.dao_dien}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quốc gia:</Text>
            <Text style={styles.infoValue}>{movie.quoc_gia}</Text>
          </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  posterContainer: {
    height: 500,
    position: 'relative',
  },
  posterImage: {
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
  movieInfo: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  originalTitle: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  playButton: {
    flex: 2,
    backgroundColor: '#FF4500',
  },
  favoriteButton: {
    flex: 1,
    borderColor: '#FFF',
  },
  episodeStatus: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  episodeText: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categories: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 14,
  },
  description: {
    padding: 16,
  },
  descriptionText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  additionalInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#999',
    width: 100,
    fontSize: 14,
  },
  infoValue: {
    color: '#FFF',
    flex: 1,
    fontSize: 14,
  },
  favoriteButton_active: {
    flex: 1,
    // borderColor: '#FFF',
    backgroundColor: '#FF4500',
  },
});

export default DetailFilm;
