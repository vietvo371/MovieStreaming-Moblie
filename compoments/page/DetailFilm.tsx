import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';

const API_URL = 'https://ophim1.com/phim/';

interface DetailFilmProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { movieSlug: string } }, 'params'>;
}

interface MovieDetail {
  id: number;
  name: string;
  thumb_url: string;
  content: string;
  dao_dien: string;
  dien_vien: string;
  the_loai: string;
  ngay_phat_hanh: string;
}

function DetailFilm({ navigation, route }: DetailFilmProps) {
  const { movieSlug } = route.params;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}${movieSlug}`)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data.movie);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details');
        setLoading(false);
      });
  }, [movieSlug]);

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

  if (!movie) {
    return null;
  }
  console.log('Movie:', movie);
  console.log('Movie:', movieSlug);
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.thumb_url }} style={styles.movieImage} />
      <Text style={styles.title}>{movie.name}</Text>
      <Text style={styles.description}>{movie.content}</Text>
      {/* <Text style={styles.info}>Đạo diễn: {movie.thumb_url}</Text>
      <Text style={styles.info}>Diễn viên: {movie.thumb_url}</Text>
      <Text style={styles.info}>Thể loại: {movie.thumb_url}</Text> */}
      <Text style={styles.info}>Ngày phát hành: {movie.year}</Text>
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Back to Home
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  movieImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetailFilm;
