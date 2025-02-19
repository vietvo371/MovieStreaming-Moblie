import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SCREEN_NAME from '../share/menu';

type MovieDetail = {
  name: string;
  origin_name: string;
  content: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  quality: string;
  lang: string;
  episode_current: string;
  category: Array<{ name: string }>;
  country: Array<{ name: string }>;
};
const API_URL = 'https://ophim1.com/phim/';


type DetailFilmProps = NativeStackScreenProps<any, 'DetailFilm'>;

const DetailFilm = ({ route, navigation }: DetailFilmProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call using route.params.movieSlug
    fetch(`${API_URL}${route.params?.movieSlug}`)
      .then(response => response.json())
      .then(data => {
        setMovie(data.movie);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      });
  }, [route.params?.movieSlug]);

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
          <Image source={{ uri: movie.thumb_url }} style={styles.posterImage} />
          <LinearGradient
            colors={['transparent', '#0D0D0D']}
            style={styles.gradientOverlay}
          />
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movie.name}</Text>
            <Text style={styles.originalTitle}>{movie.origin_name}</Text>
            <View style={styles.tags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.quality}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.lang}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{movie.year}</Text>
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
            style={styles.favoriteButton}
            icon="heart-outline"
            textColor="#FFF"
            onPress={() => {/* TODO: Implement favorite functionality */ }}
          >
            Yêu thích
          </Button>
        </View>

        {/* Episode Status */}
        <View style={styles.episodeStatus}>
          <Text style={styles.episodeText}>{movie.episode_current}</Text>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Text style={styles.sectionTitle}>Thể loại</Text>
          <View style={styles.categoryTags}>
            {movie.category.map((cat, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.sectionTitle}>Nội dung phim</Text>
          <Text style={styles.descriptionText}>
            {movie.content.replace(/<\/?[^>]+(>|$)/g, '')}
          </Text>
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
});

export default DetailFilm;
