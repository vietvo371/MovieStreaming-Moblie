import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Card, Button} from 'react-native-paper';
import {NavigationProp} from '@react-navigation/native';

const API_URL = 'https://wopai-be.dzfullstack.edu.vn/api/phim/lay-du-lieu-show';

function Home({
  navigation,
}: {
  navigation: NavigationProp<any>;
}): React.JSX.Element {
  interface Movie {
    id: number;
    ten_phim: string;
    hinh_anh: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); // Debug response
        setMovies(data.phim_moi_cap_nhats);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Text style={styles.title}>Movie App</Text>
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Cover
              source={{uri: item.hinh_anh}}
              style={styles.movieImage}
            />
            <Card.Content>
              <Text style={styles.movieTitle}>{item.ten_phim}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() =>
                  navigation.navigate('Profile', {movieId: item.id})
                }>
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 26,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  movieImage: {
    height: 200,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
